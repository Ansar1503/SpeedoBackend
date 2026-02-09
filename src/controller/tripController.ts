import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import { ITripController } from "./interfaces/iTripController";
import { ITripService } from "../services/interfaces/iTripServices";
import { STATUSCODES } from "../const/statusCodes";
import { TYPES } from "../di/types";
import { AuthRequest } from "../middlewares/authenticationMiddleware";

@injectable()
export class TripController implements ITripController {
  constructor(
    @inject(TYPES.TripService)
    private readonly _tripServices: ITripService,
  ) {}

  async uploadTrip(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError("CSV file is required", STATUSCODES.badRequest);
      }
      const userId = req.user?.userId;
      const csvText = req.file.buffer.toString("utf-8");
      await this._tripServices.uploadTrip(csvText, userId!);

      res.status(STATUSCODES.created).json({
        success: true,
        message: "trip data uploaded successfully",
      });
      return;
    } catch (error) {
      console.log("error in upload trip", error);
      next(error);
      return;
    }
  }

  async getTrips(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      let { page, limit, search } = req.query;

      const result = await this._tripServices.getTrips(
        userId!,
        isNaN(Number(page)) ? 1 : Number(page),
        isNaN(Number(limit)) ? 10 : Number(limit),
        typeof search === "string" ? search : "",
      );
      res.status(STATUSCODES.success).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });

      return;
    } catch (error) {
      next(error);
      return;
    }
  }
  async deleteTrips(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { tripIds } = req.body;

      if (!Array.isArray(tripIds) || tripIds.length === 0) {
        throw new AppError("Trip IDs are required", STATUSCODES.badRequest);
      }

      await this._tripServices.deleteTrips(userId!, tripIds);

      res.status(STATUSCODES.success).json({
        success: true,
        message: "Trips deleted successfully",
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
}
