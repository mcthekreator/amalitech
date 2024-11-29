import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import { MailService } from './services/mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: getEnvironment().smtpMailData.host,
        port: getEnvironment().smtpMailData.port,
        secure: getEnvironment().smtpMailData.secure,
        auth: getEnvironment().smtpMailData.auth,
        requireTLS: getEnvironment().smtpMailData.requireTLS,
      },
      defaults: {
        from: getEnvironment().smtpMailData.senderMail,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
