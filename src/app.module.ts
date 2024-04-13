import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PaymentsModule,
    NatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
