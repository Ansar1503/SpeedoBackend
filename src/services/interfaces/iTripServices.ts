export interface ITripService {
  uploadTrip(csvText: string, userId: string): Promise<void>;
  getTrips(): Promise<any[]>;
}
