import { Request, Response, NextFunction } from "express";

export interface ITripController {
  uploadTrip(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTrips(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteTrips(req: Request, res: Response, next: NextFunction): Promise<void>;
}
