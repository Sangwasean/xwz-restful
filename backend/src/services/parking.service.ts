// @ts-nocheck
import {
   PrismaClient,
   Parking,
   VehicleType,
   Ticket,
} from "@prisma/client";
import { CreateTicketDto, ExtendTicketDto } from "../types/custom.types";

const prisma = new PrismaClient();

class ParkingService {
   async getAllParkings(): Promise<Parking[]> {
      return prisma.parking.findMany();
   }

   async getAvailableParkings(_vehicleType: VehicleType): Promise<Parking[]> {
      return prisma.parking.findMany({
         where: {
            isAvailable: true,
         },
      });
   }

   async createParking(parkingData: {
      location: string;
      name: string;
      fee: number;
      isAvailable?: boolean;
   }): Promise<Parking> {
      return prisma.parking.create({
         data: {
            location: parkingData.location,
            name: parkingData.name,
            fee: parkingData.fee,
            isAvailable: parkingData.isAvailable ?? true,
         },
      });
   };

   async getParkingById(id: string): Promise<Parking | null> {
      return prisma.parking.findUnique({
         where: { id },
         include: {
            // Include related data if needed (e.g., current vehicle)
            vehicle: true,
            tickets: true
         }
      });
   };

   // In parking.service.ts
   async updateParking(
      id: string,
      updateData: {
         location?: string;
         name?: string;
         fee?: number;
         isAvailable?: boolean;
         vehicleId?: string | null;
      }
   ): Promise<Parking> {
      return prisma.parking.update({
         where: { id },
         data: updateData,
      });
   }

   async ticketParking(ticketData: CreateTicketDto): Promise<Ticket> {
      const { parkingId, vehicleId, startTime } = ticketData;

      // Check if parking is available
      const parking = await prisma.parking.findUnique({
         where: { id: parkingId },
      });

      if (!parking || !parking.isAvailable) {
         throw new Error("Parking spot is not available");
      }

      // Start transaction
      return prisma.$transaction(async (tx) => {
         // Create ticket
         const ticket = await tx.ticket.create({
            data: {
               parkingId,
               vehicleId,
               startTime: new Date(startTime),
               status: "ACTIVE",
            },
         });

         // Mark parking as occupied
         await tx.parking.update({
            where: { id: parkingId },
            data: {
               isAvailable: false,
               vehicleId,
            },
         });

         return ticket;
      });
   }

   async extendTicket(extendData: ExtendTicketDto): Promise<Ticket> {
      const { ticketId, additionalHours } = extendData;

      const ticket = await prisma.ticket.findUnique({
         where: { id: ticketId },
      });

      if (!ticket) {
         throw new Error("Ticket not found");
      }

      const newEndTime = new Date(
         (ticket.endTime ? ticket.endTime : new Date()).getTime() +
         additionalHours * 60 * 60 * 1000
      );

      return prisma.ticket.update({
         where: { id: ticketId },
         data: {
            endTime: newEndTime,
         },
      });
   }

   async releaseParking(ticketId: string): Promise<Ticket> {
      const ticket = await prisma.ticket.findUnique({
         where: { id: ticketId },
      });

      if (!ticket) {
         throw new Error("Ticket not found");
      }

      // Start transaction
      return prisma.$transaction(async (tx) => {
         // Update ticket
         const updatedTicket = await tx.ticket.update({
            where: { id: ticketId },
            data: {
               endTime: new Date(),
               status: "COMPLETED",
            },
         });

         // Mark parking as available
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
}

export default new ParkingService();
