import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dtos/payment-session.dto';

@Injectable()
export class PaymentsService {
    private readonly stripe: Stripe;

    constructor (
        private readonly configService: ConfigService,
    ) {
        this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET'));
    }

    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {

        const { currency, items } = paymentSessionDto;

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
            payment_intent_data: {},
            line_items: line_items,
            mode: 'payment',
            success_url: 'http://localhost:3003/payments/success',
            cancel_url: 'http://localhost:3003/payments/cancel',
        })

        return session;
    }


}
