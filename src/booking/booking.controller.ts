import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common'
import { BookingService } from './booking.service'
import { CreateBookingDto } from './dto/create-booking.dto'

@Controller('booking')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Post()
	create(@Body() createBookingDto: CreateBookingDto) {
		return this.bookingService.create(createBookingDto)
	}

	// @Get()
	// findAll() {
	//   return this.bookingService.findAll();
	// }

	// @Get(':id')
	// findOne(@Param('id') id: string) {
	//   return this.bookingService.findOne(+id);
	// }

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.bookingService.remove(+id)
	}
}
