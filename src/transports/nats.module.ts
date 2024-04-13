import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: NATS_SERVICE,
				transport: Transport.NATS,
				options: {
						servers: process.env.NATS_SERVERS.split(','),
				}
			}
		])
	],
	exports: [
		ClientsModule.register([
			{
				name: NATS_SERVICE,
				transport: Transport.NATS,
				options: {
						servers: process.env.NATS_SERVERS.split(','),
				}
			}
		])
	]
})
export class NatsModule {}
