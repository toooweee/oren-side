import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ICreateEmail } from './interfaces/createEmail.interface'

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendEmail({ fio, qrcode, email, id }: ICreateEmail): Promise<string> {
		await this.mailerService.sendMail({
			to: email, // Specify the recipient email address here
			subject: 'Заявка на бронирование',
			template: 'confirmation',
			context: {
				qrcode,
				fio,
				id,
			},
		})
		return 'email sent'
	}
}
