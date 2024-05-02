import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Render,
	NotFoundException,
} from '@nestjs/common'
import { ProfileService } from './profile.service'

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':id')
	@Render('profile')
	async getProfile(@Param('id') id: number) {
		const user = await this.profileService.profile(id)
		if (!user) throw new NotFoundException('Пользователь не найден')
		return {
			surname: user.surname,
			name: user.name,
			middlename: user.middlename,
			email: user.email,
			organization: user.organization,
			events: user.events,
			phone: user.phone,
			post: user.post,
			city: user.city,
			district: user.district,
		}
	}
}
