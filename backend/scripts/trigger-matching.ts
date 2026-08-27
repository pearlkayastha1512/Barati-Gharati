import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { BookingEngineService } from '../src/booking-engine/booking-engine.service';

async function main() {
  console.log('⚡ Manually triggering runMatchingForBooking for latest booking WD2026B5BCD80F...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const engine = app.get(BookingEngineService);

  const bookingId = '8dea3d88-fd61-444f-96b3-f626b549d717';
  await engine.runMatchingForBooking(bookingId);

  console.log('✅ Trigger completed!');
  await app.close();
}

main().catch(console.error);
