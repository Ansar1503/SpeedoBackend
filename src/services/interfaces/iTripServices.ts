import { TripType } from "../../types/tripType";

export interface ITripService {
  uploadTrip(csvText: string, userId: string): Promise<void>;
  getTrips(
    userId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    data: TripType[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
}
