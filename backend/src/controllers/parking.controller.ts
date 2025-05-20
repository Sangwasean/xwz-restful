
import { Request, Response } from "express";
import parkingService from "../services/parking.service";
import { CreateTicketDto, CreateParkingDto, ExtendTicketDto } from "../types/custom.types";
import asyncHandler from 'express-async-handler';
import { Prisma } from "@prisma/client";
class ParkingController {
   async getParkings(_req: Request, res: Response) {
      try {
         const slots = await parkingService.getAllParkings();
         res.json(slots);
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   }

   async getAvailableParkings(req: Request, res: Response) {

      try {
         const { vehicleType } = req.query;
         const parkings = await parkingService.getAvailableParkings(
            vehicleType as any
         );
         res.json(parkings);
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   }

   async createParking(req: Request, res: Response): Promise<void> {
      try {
         const parkingData: CreateParkingDto = req.body;

         // Validate fee is a positive number
         if (isNaN(Number(parkingData.fee))) {
            res.status(400).json({ message: "Fee must be a number" });
            return;
         }

         const newParking = await parkingService.createParking(parkingData);
         res.status(201).json(newParking);
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   }
   public getParkingById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const parking = await parkingService.getParkingById(id);
      if (!parking) {
         res.status(404).json({ message: "Parking slot not found" });
         return;
      }
      res.json(parking);
   });

   // In parking.controller.ts
   public updateParking = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const updateData = req.body;

      // Validate fee if provided
      if (updateData.fee && isNaN(Number(updateData.fee))) {
         res.status(400).json({ message: "Fee must be a number" });
         return;
      }

      // Convert fee to number if it's a string
      if (typeof updateData.fee === 'string') {
         updateData.fee = parseFloat(updateData.fee);
      }

      try {
         const updatedParking = await parkingService.updateParking(id, updateData);
         res.json(updatedParking);
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               res.status(404).json({ message: "Parking slot not found" });
               return;
            }
         }
         res.status(500).json({ message: error.message });
      }
   });




   async ticketParking(req: Request, res: Response) {
      try {
         const ticketData: CreateTicketDto = req.body;
         const booking = await parkingService.ticketParking(ticketData);
         res.status(201).json(booking);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }

   async extendTicket(req: Request, res: Response) {
      try {
         const extendData: ExtendTicketDto = req.body;
         const booking = await parkingService.extendTicket(extendData);
         res.json(booking);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }

   async releaseParking(req: Request, res: Response) {
      try {
         const { ticketId } = req.params;
         const ticket = await parkingService.releaseParking(ticketId);
         res.json(ticket);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }
}

export default new ParkingController();
