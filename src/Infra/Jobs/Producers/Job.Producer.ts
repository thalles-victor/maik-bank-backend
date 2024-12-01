import { JOB, KEY_OF_INJECTION } from '@metadata';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { TransactionMailSend } from '@types';

import { Queue } from 'bullmq';
import { SignUpMailSend } from 'src/Infra/Mail/Nodemailer.service';

@Injectable()
export class SendMailProducerService {
  constructor(
    @InjectQueue(KEY_OF_INJECTION.EMAIL_QUEUE)
    private readonly queue: Queue,
  ) {}

  async signUpSendMail(data: SignUpMailSend) {
    await this.queue.add(JOB.SIGNUP_EMAIL_JOB, data);
  }

  async transactionSendEmail(data: TransactionMailSend) {
    await this.queue.add(JOB.TRANSACTION_EMAIL_JOB, data);
  }
}
