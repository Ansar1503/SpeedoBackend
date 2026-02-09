import { IGPSData } from "../../models/gpsSchema";
import { ParsedGPSRow } from "../../utils/csv/gpsCsvParser";
import { IBaseRepository } from "./iBaseRepository";

export interface IGPSRepository extends IBaseRepository<IGPSData> {
  findByTrip(tripId: string): Promise<IGPSData[]>;
  insertMany(data: ParsedGPSRow[]): Promise<void>;
}
