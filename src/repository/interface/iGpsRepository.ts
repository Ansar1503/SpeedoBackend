import { IGPSData } from "../../models/gpsSchema";
import { IBaseRepository } from "./iBaseRepository";

export interface IGPSRepository extends IBaseRepository<IGPSData> {
  findByTrip(tripId: string): Promise<IGPSData[]>;
}
