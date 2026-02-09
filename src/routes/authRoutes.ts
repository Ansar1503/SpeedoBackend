import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { IAuthController } from "../controller/interfaces/iAuthController";
import { authRoutes } from "../const/routeConstants";

const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);

router.post(`${authRoutes.signup}`, authController.signup);
router.post(`${authRoutes.signin}`, authController.signin);
// router.post("/refresh"   );

export default router;
