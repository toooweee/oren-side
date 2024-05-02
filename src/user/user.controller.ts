import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	Render,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	@Get('delete/:id')
	@Render('dop')
	root(@Param('id') id: number) {
		return { id: id }
	}

	// @Get(':id')
	// findOne(@Param('id') id: string) {
	//   return this.userService.findOne(+id);
	// }
	//
	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
	//   return this.userService.update(+id, updateUserDto);
	// }
	//
	@Delete('delete/:id')
	remove(@Param('id') id: number) {
		return this.userService.remove(+id)
	}
}
