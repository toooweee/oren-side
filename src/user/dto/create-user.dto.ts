import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	surname: string

	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	middlename: string

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	phone: string

	@IsNotEmpty()
	@IsString()
	organization: string

	@IsNotEmpty()
	@IsString()
	post: string

	@IsNotEmpty()
	@IsString()
	city: string

	@IsString()
	district: string

	@IsArray()
	events: number[]
}
