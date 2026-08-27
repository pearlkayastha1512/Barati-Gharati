import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MailService } from '../src/mail/mail.service';

async function main() {
  console.log('📧 Testing MailService email dispatch from pearl.gkp@gmail.com...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const mailService = app.get(MailService);

  const recipient = 'pearl.gkp@gmail.com';
  console.log(`Sending test email to ${recipient}...`);

  await mailService.sendPrimaryBookingRequestEmail(
    recipient,
    'Bliss Photography',
    'Pearl Kayastha',
    'WD9999TEST',
    '15-12-2026',
    'Delhi',
    'Full Wedding Coverage',
    150000,
  );

  console.log('✅ Test email dispatch completed!');
  await app.close();
}

main().catch(console.error);
