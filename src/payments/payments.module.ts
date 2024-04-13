import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [
    ConfigModule,
    NatsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
