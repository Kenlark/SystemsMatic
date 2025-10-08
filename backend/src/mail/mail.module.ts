import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { EmailActionsModule } from '../email-actions/email-actions.module';

@Module({
  imports: [forwardRef(() => EmailActionsModule)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
