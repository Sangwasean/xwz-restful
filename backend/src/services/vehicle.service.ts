import { PrismaClient, Vehicle } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../utils/helpers";

const prisma = new PrismaClient();

class VehicleService {

   // In vehicle.service.ts
   async getAllVehicles(): Promise<Vehicle[]> {
      return prisma.vehicle.findMany({
         include: {
            user: {  // Include user information if needed
               select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
               }
            },
            tickets: true  // Include tickets if needed
         },
         orderBy: {
            createdAt: 'desc'  // Optional: order by creation date
         }
      });
   }
   async createVehicle(
      plateNumber: string,
      userId: string
   ): Promise<Vehicle> {
      // Check if vehicle already exists
      const existingVehicle = await prisma.vehicle.findUnique({
         where: { plateNumber },
      });

      if (existingVehicle) {
         throw new BadRequestError("Vehicle with this plate number already exists");
      }

      return prisma.vehicle.create({
         data: {
            plateNumber,
            userId,
         },
      });
   }

   async getVehicleById(id: string): Promise<Vehicle> {
      const vehicle = await prisma.vehicle.findUnique({
         where: { id },
      });

      if (!vehicle) {
         throw new NotFoundError("Vehicle not found");
      }

      return vehicle;
   }

   async getVehiclesByUser(userId: string): Promise<Vehicle[]> {
      const vehicles = await prisma.vehicle.findMany({
         where: { userId },
      });

      if (vehicles.length === 0) {
         throw new NotFoundError("No vehicles found for this user");
      }

      return vehicles;
   }

   async updateVehicle(
      id: string,
      plateNumber: string,
   ): Promise<Vehicle> {
      // First check if vehicle exists
      const existingVehicle = await prisma.vehicle.findUnique({
         where: { id },
      });

      if (!existingVehicle) {
         throw new NotFoundError("Vehicle not found");
      }

      // Then check if new plate number is already taken
      const vehicleWithSamePlate = await prisma.vehicle.findFirst({
         where: {
            plateNumber,
            NOT: { id },
         },
      });

      if (vehicleWithSamePlate) {
         throw new BadRequestError("Vehicle with this plate number already exists");
      }

      return prisma.vehicle.update({
         where: { id },
         data: {
            plateNumber,
         },
      });
   }

   async deleteVehicle(id: string): Promise<Vehicle> {
      // First check if vehicle exists
      const vehicle = await prisma.vehicle.findUnique({
         where: { id },
      });

      if (!vehicle) {
         throw new NotFoundError("Vehicle not found");
      }

      // Check if vehicle has active bookings
      const activeBookings = await prisma.ticket.findFirst({
         where: {
            vehicleId: id,
            status: "ACTIVE",
         },
      });

      if (activeBookings) {
         throw new BadRequestError("Cannot delete vehicle with active bookings");
      }

      return prisma.vehicle.delete({
         where: { id },
      });
   }
}

export default new VehicleService();