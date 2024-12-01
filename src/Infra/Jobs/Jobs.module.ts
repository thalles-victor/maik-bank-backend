import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { SendMailProducerService } from './Producers/Job.Producer';
import { SendmailConsumer } from './Consumers/Job.consumer';
import { MailModule } from '../Mail/Mail.module';
import { KEY_OF_INJECTION } from '@metadata';

@Module({
  imports: [
    MailModule,
    BullModule.registerQueue({
      name: KEY_OF_INJECTION.EMAIL_QUEUE,
    }),
  ],
  providers: [SendMailProducerService, SendmailConsumer],
  exports: [SendMailProducerService],
})
export class JobsModules {}
