import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import { ITripController } from "./interfaces/iTripController";

@injectable()
export class TripController implements ITripController {
  async uploadTrip(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError("CSV file is required", 400);
      }
      const csvText = req.file.buffer.toString("utf-8");
      res.status(201).json({ success: true });
      return
    } catch (error) {
      next(error);
      return
    }
  }

  async getTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      res.json({ success: true });
      return
    } catch (error) {
      next(error);
      return
    }
  }
}
