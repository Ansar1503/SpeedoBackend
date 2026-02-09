import { IGPSData } from "../../models/gpsSchema";
import { IGPSRepository } from "../interface/iGpsRepository";
import { BaseRepository } from "./baseRepository";
import GPSModel from "../../models/gpsSchema";
import { isValidObjectId, Types } from "mongoose";
import { ParsedGPSRow } from "../../utils/csv/gpsCsvParser";

export class GPSRepository
  extends BaseRepository<IGPSData>
  implements IGPSRepository
{
  constructor() {
    super(GPSModel);
  }
  async insertMany(data: ParsedGPSRow[]): Promise<void> {
    await this.model.insertMany(data);
  }
  async deleteByTripIds(tripIds: string[]): Promise<void> {
    await this.model.deleteMany({ tripId: { $in: tripIds } });
  }
  async findByTripId(tripId: string): Promise<IGPSData[]> {
    return await this.model.find({ tripId });
  }
}
