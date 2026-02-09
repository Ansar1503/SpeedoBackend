import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../di/types";
import { IAuthController } from "./interfaces/iAuthController";
import { IAuthService } from "../services/interfaces/iAuthServices";
import { STATUSCODES } from "../const/statusCodes";
import { AppError } from "../errors/appError";
import { api, authRoutes } from "../const/routeConstants";

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
      const result = await this.authService.signup({ name, email, password });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: `${api}${authRoutes.auth}${authRoutes.refresh}`,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(STATUSCODES.created).json({
        success: true,
        message: "Signup successful",
        accessToken: result.accessToken,
        data: result.user,
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }

  async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email?.trim()) throw new AppError("email not found. enter a email");
      if (!password?.trim())
        throw new AppError("password not found. please enter password");
      const result = await this.authService.signin({ email, password });

      res.status(STATUSCODES.success).json({
        success: true,
        message: "Signin successful",
        data: result.user,
        accessToken: result.accessToken,
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new AppError("Refresh token missing", STATUSCODES.forbidden);
      }

      const accessToken = await this.authService.refresh(refreshToken);

      res.status(STATUSCODES.success).json({
        success: true,
        accessToken,
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("refreshToken", {
      path: "/api/auth/refresh",
    });

    res.status(STATUSCODES.success).json({
      success: true,
      message: "Logged out successfully",
    });
    return;
  }
}
