import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../di/types";
import { IAuthController } from "./interfaces/iAuthController";
import { IAuthService } from "../services/interfaces/iAuthServices";
import { STATUSCODES } from "../const/statusCodes";
import { AppError } from "../errors/appError";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthServices)
    private readonly authService: IAuthService,
  ) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;
      if (!name?.trim()) throw new AppError("name not found. enter a name");
      if (!email?.trim()) throw new AppError("email not found. enter a email");
      if (!password?.trim())
        throw new AppError("password not found. please enter password");
      await this.authService.signup({ name, email, password });

      res.status(STATUSCODES.created).json({
        success: true,
        message: "Signup successful",
      });
    } catch (error) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      await this.authService.signin({ email, password });

      res.status(STATUSCODES.success).json({
        success: true,
        message: "Signin successful",
      });
    } catch (error) {
      next(error);
    }
  }
}
