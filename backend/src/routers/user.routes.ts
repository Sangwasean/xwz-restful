
import { Router } from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.get(
   "/",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   userController.getAllUsers
);
router.get(
   "/:id",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   userController.getUserById
);
router.patch(
   "/:id/role",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   userController.updateUserRole
);
router.delete(
   "/:id",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   userController.deleteUser
);

export { router as UsersRouter };
