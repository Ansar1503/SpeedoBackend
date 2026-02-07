import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

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
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }
  if (err.message) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  console.error("❌ Unexpected Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
  return;
};
