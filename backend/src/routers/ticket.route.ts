// routes/booking.routes.ts
import { Router } from 'express';
import ticketController from '../controllers/ticket.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Request, Response } from 'express';
const router = Router();

// Protected routes
router.get('/', authMiddleware, ticketController.getMyTickets);
router.get('/:id', authMiddleware, ticketController.getTicketById);
router.post(
  '/',
  authMiddleware,
  (req: Request, res: Response) => ticketController.createTicket(req, res)
);
router.post(
  '/:id/cancel',
  authMiddleware,
  ticketController.cancelTicket
);

// Admin-only routes
router.get(
  '/tickets',
  authMiddleware,
  roleMiddleware(['ADMIN', 'PARKING_ATTENDANT']),
  ticketController.getAllTickets
);

export { router as TicketRouter }