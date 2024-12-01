import { env } from '@utils';
import NodeMailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { signUpHtml, transactionHtmlEmail } from './html';
import { TransactionAggregate } from 'src/Domain/Aggregates/Transactions.aggregate';
import { TransactionMailSend } from '@types';

export interface SignUpMailSend {
  email: string;
  name: string;
}

export class NodeMailerService {
  private readonly transport: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  constructor() {
    this.transport = NodeMailer.createTransport({
      host: env.NODE_MAILER_HOST,
      port: env.NODE_MAILER_PORT,
      auth: {
        user: env.NODE_MAILER_USER,
        pass: env.NODE_MAILER_PASSWORD,
      },
    });
  }

  async signUpMailSend({ email, name }: SignUpMailSend) {
    await this.transport.sendMail({
      from: 'Maik Bank <maik.bank@gmail.com>',
      to: email,
      subject: 'Criação de conta',
      text: `${name}, te agradecemos por ter criado uma conta na nossa plataforma \n espero que goste de nossso serviço :)`,
      html: signUpHtml(name, email),
    });
  }

  async transactionMailSend({ users, transaction }: TransactionMailSend) {
    users.forEach(async (_user_) => {
      const html = transactionHtmlEmail(_user_.name, _user_.email, transaction);

      await this.transport.sendMail({
        from: '"Maik Bank <maik.bank@gmail.com>',
        to: _user_.email,
        text: 'Transação bancária',
        html,
      });
    });
  }
}
