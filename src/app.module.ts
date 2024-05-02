import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { EventModule } from './event/event.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookingModule } from './booking/booking.module'
import { QrcodeModule } from './qrcode/qrcode.module'
import { ProfileModule } from './profile/profile.module'
import * as process from 'process'

@Module({
	imports: [
		UserModule,
		EventModule,
		BookingModule,
		QrcodeModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DB_HOST'),
				port: configService.get('DB_PORT'),
				username: configService.get('DB_USERNAME'),
				password: configService.get('DB_PASSWORD'),
				database: configService.get('DB_NAME'),
				synchronize: true,
				entities: [__dirname + '/**/*.entity{.js, .ts}'],
			}),
			inject: [ConfigService],
		}),
		ProfileModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
