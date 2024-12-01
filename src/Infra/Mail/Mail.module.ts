import { Module } from '@nestjs/common';
import { NodeMailerService } from './Nodemailer.service';

@Module({
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
export class MailModule {}
