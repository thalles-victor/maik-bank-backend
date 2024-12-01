import { JOB, KEY_OF_INJECTION } from '@metadata';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  NodeMailerService,
  SignUpMailSend,
} from 'src/Infra/Mail/Nodemailer.service';

@Processor(KEY_OF_INJECTION.EMAIL_QUEUE)
export class SendmailConsumer extends WorkerHost {
  constructor(private readonly mailService: NodeMailerService) {
    super();
  }

  async process(job: Job): Promise<any> {
    const data = job.data;

    if (job.name === JOB.SIGNUP_EMAIL_JOB) {
      await this.signUpSendMailJob(data);
      return;
    }

    if (job.name === JOB.TRANSACTION_EMAIL_JOB) {
      await this.transactionSendMailJob(data);
    }

    throw new Error('Job not found');
  }

  private async signUpSendMailJob(data: SignUpMailSend) {
    await this.mailService.signUpMailSend(data);
  }

  private async transactionSendMailJob(data) {
    await this.mailService.transactionMailSend(data);
  }
}
