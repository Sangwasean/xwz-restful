// routes/parking.routes.ts
import { Router } from "express";
import parkingController from "../controllers/parking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { CreateTicketDto, ExtendTicketDto } from "../types/custom.types";
import { validationMiddleware } from "../middlewares/validation.middleware";

const router = Router();

// Public routes
router.get("/", parkingController.getParkings);
router.get("/available", parkingController.getAvailableParkings);
router.post(
   "/",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   parkingController.createParking
);

router.get(
   "/:id",
   authMiddleware,
   parkingController.getParkingById
);

router.patch(
   "/:id",
   authMiddleware,
   roleMiddleware(["ADMIN"]), // Only admins can update parking
   parkingController.updateParking
);

// Protected routes
router.post(
   "/ticket",
   authMiddleware,
   validationMiddleware(CreateTicketDto),
   parkingController.ticketParking
);

router.post(
   "/extend",
   authMiddleware,
   validationMiddleware(ExtendTicketDto),
   parkingController.extendTicket
);

router.post(
   "/release/:ticketId",
   authMiddleware,
   roleMiddleware(["ADMIN", "PARKING_ATTENDANT"]),
   parkingController.releaseParking
);

export { router as ParkingRouter };
