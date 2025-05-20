
import { Router } from "express";
import paymentController from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Protected routes
router.post("/payments", authMiddleware, paymentController.createPayment);
router.get("/payments/me", authMiddleware, paymentController.getMyPayments);
router.get("/payments/:id", authMiddleware, paymentController.getPaymentById);
router.post(
   "/payments/:id/process",
   authMiddleware,
   roleMiddleware(["ADMIN", "ATTENDANT"]),
   paymentController.processPayment
);

// Admin-only routes
router.get(
   "/payments",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   paymentController.getAllPayments
);
router.post(
   "/payments/:id/refund",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   paymentController.refundPayment
);

export { router as PaymentRouter };
