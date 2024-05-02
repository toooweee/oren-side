import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateBookingDto } from './dto/create-booking.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Booking } from './entities/booking.entity'
import { Event } from '../event/entities/event.entity'
import { QrcodeService } from '../qrcode/qrcode.service'
import { EmailService } from '../mailer/mailer.service'
import { EventService } from '../event/event.service'

@Injectable()
export class BookingService {
	constructor(
		@InjectRepository(Booking)
		private readonly bookingRepository: Repository<Booking>,
		private readonly qrcodeService: QrcodeService,
		private readonly emailService: EmailService,
		private readonly eventService: EventService,
		// private readonly userService: UserService
	) {}

	async create(createBookingDto: CreateBookingDto) {
		const booking = await this.bookingRepository.save({
			user: createBookingDto.user,
			event: createBookingDto.event,
		})

		// const user = await this.userService.findOne(createBookingDto.user.id);
		const qrcode = await this.qrcodeService.create({
			booking: booking,
			url: `http://localhost:3000/profile/profile/${createBookingDto.user.id}`,
		})
		await this.emailService.sendEmail({
			fio: createBookingDto.user.surname,
			qrcode,
			email: createBookingDto.user.email,
			id: createBookingDto.user.id,
		})
		return { booking }
	}

	//byprob03@gmail.com

	findAll() {
		return `This action returns all booking`
	}

	findOne(event: Event) {
		return this.bookingRepository.findOne({ where: { event: event } })
	}

	async remove(id: number) {
		const existBooking = await this.bookingRepository.findOne({
			where: {
				id: id,
			},
		})
		if (existBooking) {
			await this.bookingRepository.delete(id)
		} else {
			throw new BadRequestException('Такого письма не существует')
		}
	}
}
