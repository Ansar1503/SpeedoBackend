import { ITrip } from "../../models/tripSchema";
import { ITripRepository } from "../interface/iTripInterface";
import { BaseRepository } from "./baseRepository";
import TripModel from "../../models/tripSchema";
import { isValidObjectId, Types } from "mongoose";

export class TripRepository
  extends BaseRepository<ITrip>
  implements ITripRepository
{
  constructor() {
    super(TripModel);
  }

  async findAllTrips(
    userId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<{ trips: ITrip[]; total: number }> {
    const skip = (page - 1) * limit;

    const query: any = {
      userId: new Types.ObjectId(userId),
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const [trips, total] = await Promise.all([
      this.model.find(query).skip(skip).limit(limit).exec(),
      this.model.countDocuments(query),
    ]);

    return { trips, total };
  }
}
