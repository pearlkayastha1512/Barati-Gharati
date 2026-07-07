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
      useFactory: (config: ConfigService) => ({
       transport: {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: config.get('MAIL_USER'),
    pass: config.get('MAIL_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
},
        defaults: {
          from: config.get<string>('MAIL_FROM'),
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
