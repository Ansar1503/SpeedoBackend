export interface ITripService {
  uploadTrip(csvText: string): Promise<void>;
  getTrips(): Promise<any[]>;
}
