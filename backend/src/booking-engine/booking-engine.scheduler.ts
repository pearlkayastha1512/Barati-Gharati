import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingEngineService } from './booking-engine.service';

@Injectable()
export class BookingEngineScheduler {
  private readonly logger = new Logger(BookingEngineScheduler.name);

  constructor(private readonly engine: BookingEngineService) {}

  /**
   * Runs every 15 minutes.
   * Finds all vendor assignments past their timeout deadline and processes them:
   * - Deducts leads from timed-out vendors
   * - Promotes next standby vendor
   * - Notifies admin if no standby remains
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleTimeouts(): Promise<void> {
    this.logger.log('[Scheduler] Running timeout check...');
    try {
      await this.engine.handleTimedOutAssignments();
      this.logger.log('[Scheduler] Timeout check complete');
    } catch (err) {
      this.logger.error(`[Scheduler] Timeout check failed: ${err}`);
    }
  }
}
