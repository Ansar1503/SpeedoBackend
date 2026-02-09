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

  async findByUser(userId: string): Promise<ITrip[]> {
    const id = new Types.ObjectId(userId);
    if (!isValidObjectId(id))
      throw new Error(
        "invalid user id provided. please provide a valid user id",
      );
    return await this.find({ userId: id });
  }
}
