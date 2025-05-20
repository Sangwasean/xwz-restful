// @ts-nocheck
import { Request, Response } from "express";
import paymentService from "../services/payment.service";
import { BadRequestError } from "../utils/helpers";

class PaymentController {
   async createPayment(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         const { amount, ticketId, method } = req.body;
         const payment = await paymentService.createPayment(
            amount,
            ticketId,
            req.user.id,
            method
         );
         res.status(201).json(payment);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async processPayment(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const payment = await paymentService.processPayment(id);
         res.json(payment);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getMyPayments(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         const payments = await paymentService.getUserPayments(req.user.id);
         res.json(payments);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getPaymentById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const payment = await paymentService.getPaymentById(id);
         if (!payment) {
            throw new BadRequestError("Payment not found");
         }
         res.json(payment);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getAllPayments(req: Request, res: Response) {
      try {
         const payments = await paymentService.getAllPayments();
         res.json(payments);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async refundPayment(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const payment = await paymentService.refundPayment(id);
         res.json(payment);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }
}

export default new PaymentController();
