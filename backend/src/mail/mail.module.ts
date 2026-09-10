import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mailHost = (config.get<string>('MAIL_HOST') || 'smtp.gmail.com').trim();
        const mailPort = Number((config.get<string>('MAIL_PORT') || '465').trim());
        const rawUser = config.get<string>('MAIL_USER') || 'shuklapranjali29@gmail.com';
        const rawPass = config.get<string>('MAIL_PASSWORD') || 'pbikrohptfkavecc';
        const mailFrom = (config.get<string>('MAIL_FROM') || '"Barati Gharati" <shuklapranjali29@gmail.com>').trim();

        const user = rawUser.trim();
        const pass = rawPass.replace(/\s+/g, '');

        return {
          transport: {
            host: mailHost,
            port: mailPort,
            secure: mailPort === 465,
            auth: { user, pass },
            tls: {
              rejectUnauthorized: false,
            },
            connectionTimeout: 10000, // 10s connection timeout
            greetingTimeout: 10000,
            socketTimeout: 15000,
          },
          defaults: {
            from: mailFrom,
          },
        };
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
