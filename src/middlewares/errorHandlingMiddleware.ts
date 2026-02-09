import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import { STATUSCODES } from "../const/statusCodes";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }
  if (err.name === "MulterError") {
    res.status(STATUSCODES.badRequest).json({
      success: false,
      message: err.message,
    });
    return;
  }
  if (err.message) {
    res.status(STATUSCODES.badRequest).json({ success: false, message: err.message });
    return;
  }
  console.error("❌ Unexpected Error:", err);

  res.status(STATUSCODES.internalServerError).json({
    success: false,
    message: "Internal server error",
  });
  return;
};
