import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import { ITripController } from "./interfaces/iTripController";
import { ITripService } from "../services/interfaces/iTripServices";
import { STATUSCODES } from "../const/statusCodes";
import { TYPES } from "../di/types";

@injectable()
export class TripController implements ITripController {
  constructor(
    @inject(TYPES.TripService)
    private readonly _tripServices: ITripService,
  ) {}

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
      await this._tripServices.uploadTrip(csvText);

      res.status(STATUSCODES.created).json({
        success: true,
        message: "trip data uploaded successfully",
      });
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
      res.status(STATUSCODES.success).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
