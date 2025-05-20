// @ts-nocheck
import { Request, Response } from "express";
import vehicleService from "../services/vehicle.service";
import { BadRequestError } from "../utils/helpers";

class VehicleController {

   // In vehicle.controller.ts
   async getAllVehicles(req: Request, res: Response) {
      try {
         const vehicles = await vehicleService.getAllVehicles();
         res.json(vehicles);
      } catch (error) {
         res.status(error.statusCode || 500).json({
            message: error.message || 'Failed to fetch vehicles'
         });
      }
   }
   async createVehicle(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         const { plateNumber } = req.body;
         const vehicle = await vehicleService.createVehicle(
            plateNumber,
            req.user.id
         );
         res.status(201).json(vehicle);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getMyVehicles(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         const vehicles = await vehicleService.getVehiclesByUser(req.user.id);
         res.json(vehicles);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getVehicleById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const vehicle = await vehicleService.getVehicleById(id);
         if (!vehicle) {
            throw new BadRequestError("Vehicle not found");
         }
         res.json(vehicle);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async updateVehicle(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const { plateNumber } = req.body;
         const vehicle = await vehicleService.updateVehicle(
            id,
            plateNumber
         );
         res.json(vehicle);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async deleteVehicle(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const vehicle = await vehicleService.deleteVehicle(id);
         res.json(vehicle);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }
}

export default new VehicleController();
