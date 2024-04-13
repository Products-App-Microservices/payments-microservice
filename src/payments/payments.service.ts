import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import Stripe from 'stripe';

import { PaymentSessionDto } from './dtos/payment-session.dto';
import { NATS_SERVICE } from 'src/config/services';

@Injectable()
export class PaymentsService {
    private readonly stripe: Stripe;

    constructor (
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,

        private readonly configService: ConfigService,
    ) {
        this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET'));
    }

    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {

        const { currency, items, orderId } = paymentSessionDto;

        const line_items = items.map( item => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round( item.price * 100 ) // Equivale a USD$20
            },
            quantity: item.quantity,
        }))

        const session = await this.stripe.checkout.sessions.create({
            payment_intent_data: {
                metadata: {
                    orderId: orderId,
                }
            },
            line_items: line_items,
            mode: 'payment',
            success_url: this.configService.getOrThrow<string>('STRIPE_SUCCESS_URL'),
            cancel_url: this.configService.getOrThrow<string>('STRIPE_CANCEL_URL'),
        })

        return session;
    }

    async stripeWebhook(req: Request, res: Response) {
        const endpointSecret = this.configService.getOrThrow<string>('STRIPE_SECRET_URL');
        const sig = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        switch (event.type) {
            case 'charge.succeeded':
              const chargeSucceeded = event.data.object;
              const payload = {
                stripePaymentId: chargeSucceeded.id,
                paymentOrderId: chargeSucceeded.metadata.orderId,
                receiptUrl: chargeSucceeded.receipt_url,
              }

              this.client.emit('charge.succeeded', payload);
              break;
            default:
              console.log(`Unhandled event type ${event.type}`);
          }

        res.status(200).json({
            ok: true,
            message: 'Payment received',
        })
    }


}
