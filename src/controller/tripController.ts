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

      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async getTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
