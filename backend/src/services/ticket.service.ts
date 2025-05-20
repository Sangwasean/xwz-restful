// @ts-nocheck
import { PrismaClient, Ticket, TicketStatus } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../utils/helpers";

const prisma = new PrismaClient();

class TicketService {

   // src/services/ticket.service.ts
   async createTicket(ticketData: CreateTicketDto): Promise<Ticket> {
      return prisma.$transaction(async (tx) => {
         // Check if parking spot exists and is available
         const parking = await tx.parking.findUnique({
            where: { id: ticketData.parkingId },
         });

         if (!parking) {
            throw new NotFoundError("Parking spot not found");
         }
         if (!parking.isAvailable) {
            throw new BadRequestError("Parking spot is not available");
         }

         // Check if vehicle exists
         const vehicle = await tx.vehicle.findUnique({
            where: { id: ticketData.vehicleId },
         });
         if (!vehicle) {
            throw new NotFoundError("Vehicle not found");
         }

         // Create the ticket
         const ticket = await tx.ticket.create({
            data: {
               parkingId: ticketData.parkingId,
               vehicleId: ticketData.vehicleId,
               startTime: ticketData.startTime ? new Date(ticketData.startTime) : new Date(),
               status: "ACTIVE",
            },
         });

         // Mark parking as occupied
         await tx.parking.update({
            where: { id: ticketData.parkingId },
            data: {
               isAvailable: false,
               vehicleId: ticketData.vehicleId,
            },
         });

         return ticket;
      });
   }
   async getTicketById(id: string): Promise<Ticket | null> {
      return prisma.ticket.findUnique({
         where: { id },
         include: {
            parking: true,
            vehicle: true,
            payment: true,
         },
      });
   }

   async getUserTickets(userId: string): Promise<Ticket[]> {
      return prisma.ticket.findMany({
         where: {
            vehicle: {
               userId,
            },
         },
         include: {
            parking: true,
            vehicle: true,
            payment: true,
         },
         orderBy: {
            startTime: "desc",
         },
      });
   }

   async getAllTickets(): Promise<Ticket[]> {
      return prisma.ticket.findMany({
         include: {
            parking: true,
            vehicle: {
               include: {
                  user: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                     },
                  },
               },
            },
            payment: true,
         },
         orderBy: {
            startTime: "desc",
         },
      });
   }

   async cancelTicket(ticketid: string): Promise<Ticket> {
      return prisma.$transaction(async (tx) => {
         const ticket = await tx.ticket.findUnique({
            where: { id: ticketId },
         });

         if (!ticket) {
            throw new NotFoundError("Ticket not found");
         }

         if (ticketstatus !== "ACTIVE") {
            throw new BadRequestError("Only active tickets can be cancelled");
         }

         // Update booking
         const updatedTicket = await tx.ticket.update({
            where: { id: ticketId },
            data: {
               status: "CANCELLED",
               endTime: new Date(),
            },
         });

         // Mark slot as available
         await tx.parking.update({
            where: { id: ticket.parkingId },
            data: {
               isAvailable: true,
               vehicleId: null,
            },
         });

         return updatedTicket;
      });
   }

   async checkOverstayTickets(): Promise<void> {
      // Find all active bookings that have exceeded their expected duration
      const overstayTickets = await prisma.ticket.findMany({
         where: {
            status: "ACTIVE",
            endTime: {
               lt: new Date(), // endTime is in the past
            },
         },
      });

      // Mark them as overstay
      for (const ticket of overstayTickets) {
         await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
               status: "OVERSTAY",
            },
         });
      }
   }
}

export default new TicketService();
