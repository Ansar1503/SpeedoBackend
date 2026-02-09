import { ITrip } from "../../models/tripSchema";
import { IBaseRepository } from "./iBaseRepository";

export interface ITripRepository extends IBaseRepository<ITrip> {
  findAllTrips(
    userId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<{ trips: ITrip[]; total: number }>;
}
