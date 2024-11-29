import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';

interface MailTextAndSubject {
  subject: string;
  text: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendOneTimeToken(to: string, password: string): Promise<unknown> {
    const subjectAndTextForEnvironment = this.getTextAndSubjectForEnvironment(to, password);

    const emailResult = await this.mailerService.sendMail({
      to,
      subject: subjectAndTextForEnvironment.subject,
      text: subjectAndTextForEnvironment.text,
    });

    return emailResult;
  }

  private getTextAndSubjectForEnvironment(to: string, password: string): MailTextAndSubject {
    let subject: string;
    let text: string;

    const devSubjectAndText = {
      subject: 'Welcome to iCalc!',
      text: `You are invited to use iCalc.

      You can now access iCalc with this URL: ${getEnvironment().icalcFrontend}
      To login, please use your Email (${to}).
      And the following password: ${password}
      If you have any questions or suggestions regarding iCalc, please contact ${
        getEnvironment().smtpMailData.senderMail
      }`,
    };

    const stagingSubjectAndText = {
      subject: 'Welcome to iCalc - Test Environment!',
      text: `Hi, you are invited to use iCalc.

      You can now access the iCalc - Test Environment - with this URL: ${getEnvironment().icalcFrontend}
      This Test Environment can be used to test new features before they are released on the Productive Environment.
      Your credentials for the Productive Environment will follow shortly in a separate email.

      To login, please use your email: ${to}
      and the following password: ${password}

      In case of problems with your login, or if you have any questions or suggestions regarding iCalc, please contact de-icalc-support@igus.net

      Best regards,
      your iCalc Team`,
    };

    const prodSubjectAndText = {
      subject: 'Welcome to iCalc - Productive Environment!',
      text: `Hi, you are invited to use iCalc.

      You can now access the iCalc - Productive Environment - with this URL: ${getEnvironment().icalcFrontend}

      To login, please use your email: ${to}
      and the following password: ${password}

      In case of problems with your login, or if you have any questions or suggestions regarding iCalc, please contact de-icalc-support@igus.net

      Best regards,
      your iCalc Team`,
    };

    if (getEnvironment().env === 'development' || getEnvironment().env === 'integration') {
      subject = devSubjectAndText.subject;
      text = devSubjectAndText.text;
    }

    if (getEnvironment().env === 'staging') {
      subject = stagingSubjectAndText.subject;
      text = stagingSubjectAndText.text;
    }

    if (getEnvironment().env === 'production') {
      subject = prodSubjectAndText.subject;
      text = prodSubjectAndText.text;
    }

    return {
      subject,
      text,
    };
  }
}
