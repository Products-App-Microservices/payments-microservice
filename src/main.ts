import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('PaymentsMain');

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: process.env.NATS_SERVERS.split(',')
    }
  }, 
  // This configuration is for validate dtos in hybrid applications (HTTP-Microservice) 
  { inheritAppConfig: true, })

  await app.startAllMicroservices();

  await app.listen(process.env.PORT);

  logger.log(`Payments microservice running on port ${ process.env.PORT }`)
}
bootstrap();
