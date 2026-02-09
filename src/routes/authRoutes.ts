import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { IAuthController } from "../controller/interfaces/iAuthController";

const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
// router.post("/refresh");

export default router;
