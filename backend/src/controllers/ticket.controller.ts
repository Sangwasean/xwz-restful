// controllers/ticket.controller.ts
import { Request, Response } from "express";
import ticketService from "../services/ticket.service";
import { CreateTicketDto } from "../types/custom.types";
import { BadRequestError } from "../utils/helpers";

class TicketController {

   // src/controllers/ticket.controller.ts
   // In your ticket.controller.ts
   async createTicket(req: Request, res: Response): Promise<void> {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }

         const ticketData: CreateTicketDto = req.body;
         const ticket = await ticketService.createTicket(ticketData);
         res.status(201).json(ticket);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }
   async getTicketById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const ticket = await ticketService.getTicketById(id);
         if (!ticket) {
            throw new BadRequestError("Ticket not found");
         }
         res.json(ticket);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getMyTickets(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         //@ts-ignore
         const tickets = await ticketService.getUserTickets(req.user.id);
         res.json(tickets);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async cancelTicket(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const ticket = await ticketService.cancelTicket(id);
         res.json(ticket);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getAllTickets(_req: Request, res: Response) {
      try {
         const tickets = await ticketService.getAllTickets();
         res.json(tickets);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }
}

export default new TicketController();
