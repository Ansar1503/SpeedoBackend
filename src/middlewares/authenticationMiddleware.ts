import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/appError";
import { STATUSCODES } from "../const/statusCodes";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization token missing", STATUSCODES.forbidden);
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!,
    ) as {
      userId: string;
      email: string;
    };

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    console.log("error",error)
    next(
      new AppError("Invalid or expired access token", STATUSCODES.forbidden),
    );
  }
};
