import { IGPSData } from "../../models/gpsSchema";
import { ParsedGPSRow } from "../../utils/csv/gpsCsvParser";
import { IBaseRepository } from "./iBaseRepository";

export interface IGPSRepository extends IBaseRepository<IGPSData> {
  insertMany(data: ParsedGPSRow[]): Promise<void>;
  deleteByTripIds(tripIds: string[]): Promise<void>;
  findByTripId(tripId: string): Promise<IGPSData[]>;
}
