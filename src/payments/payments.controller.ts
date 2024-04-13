import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Request, Response } from 'express';

import { PaymentSessionDto } from './dtos';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  @MessagePattern('create.payment.session')
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment successful',
    }
  }

  @Get('cancel')
  cancel() {
    return {
      ok: false,
      message: 'Payment cancelled',
    }
  }

  @Post('webhook')
  stripeWebhook( @Req() req: Request, @Res() res: Response ) {
    return this.paymentsService.stripeWebhook(req, res);
  }

}
