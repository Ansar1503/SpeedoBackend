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

  async findByTrip(tripId: string): Promise<IGPSData[]> {
    const id = new Types.ObjectId(tripId);
    if (!isValidObjectId(id))
      throw new Error(
        "invalid trip id provided. please provide a valid trip id",
      );
    return await this.find({ tripId: id });
  }
  async insertMany(data: ParsedGPSRow[]): Promise<void> {
    await this.model.insertMany(data);
  }
}
