import { BadRequestException, Delete, Injectable, Param } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { QrcodeService } from '../qrcode/qrcode.service'
import { EventService } from '../event/event.service'
import { BookingService } from '../booking/booking.service'
import { Booking } from '../booking/entities/booking.entity'
import { Event } from '../event/entities/event.entity'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly eventService: EventService,
		private readonly bookingService: BookingService,
		@InjectRepository(Booking)
		private readonly bookingRepository: Repository<Booking>,
		@InjectRepository(Event)
		private readonly eventRepository: Repository<Event>,
		private readonly qrcodeService: QrcodeService,
	) {}

	async create(createUserDto: CreateUserDto) {
		const { events, ...userData } = createUserDto
		const existUser = await this.userRepository.findOne({
			where: {
				email: createUserDto.email,
			},
		})
		if (existUser)
			throw new BadRequestException('This email already exist!')

		const user = await this.userRepository.save({
			surname: createUserDto.surname,
			name: createUserDto.name,
			middlename: createUserDto.middlename,
			email: createUserDto.email,
			phone: createUserDto.phone,
			organization: createUserDto.organization,
			post: createUserDto.post,
			city: createUserDto.city,
			district: createUserDto.district,
			events: createUserDto.events,
		})

		await Promise.all(
			events.map(async (eventId) => {
				const event = await this.eventService.findOne(eventId)
				if (event) {
					if (event.available_seats <= 0) {
						throw new BadRequestException(
							`Нет доступных мест для события "${event.name}"`,
						)
					}

					try {
						await this.bookingService.create({
							user: user,
							event: event,
						})
					} catch {
						throw new BadRequestException('Что за бред')
					}

					event.available_seats--
					await this.eventRepository.save(event)
				} else {
					throw new BadRequestException(
						'Такого мероприятия не существует',
					)
				}
			}),
		)

		// const event = await this.eventService.findOne(createUserDto.userEvent);
		return { user }
	}

	findOne(id: number) {
		return this.userRepository.findOne({ where: { id: id } })
	}

	// findAll() {
	//     return `This action returns all user`;
	// }

	// update(updateUserDto: UpdateUserDto) {
	//     // ищем по емайлу
	//     // обноляем пользователя
	//     return `This action updates a # user`;
	// }

	async remove(id: number) {
		const existUser = await this.userRepository.findOne({
			where: {
				id: id,
			},
		})
		if (existUser) {
			await this.userRepository.delete(id)
		} else {
			throw new BadRequestException('Такого пользователся не существует')
		}

		await Promise.all(
			existUser.events.map(async (eventId) => {
				const event = await this.eventService.findOne(eventId)
				if (event) {
					const existBooking = await this.bookingRepository.findOne({
						where: {
							event: event,
						},
					})

					existBooking.event.available_seats++
					await this.eventRepository.save(existBooking.event)
				} else {
					throw new BadRequestException(
						'Такого мероприятия не существует',
					)
				}
			}),
		)
	}
}
