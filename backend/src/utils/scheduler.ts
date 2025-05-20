// utils/scheduler.ts
import cron from 'node-cron';
import ticketService from '../services/ticket.service';
import logger from './logger';

export function startScheduledJobs() {
  // Check for overstay bookings every hour
  cron.schedule('0 * * * *', async () => {
    try {
      logger.info('Running overstay booking check');
      await ticketService.checkOverstayTickets();
    } catch (error) {
      logger.error('Error in overstay ticket check:', error);
    }
  });

  logger.info('Scheduled jobs started');
}