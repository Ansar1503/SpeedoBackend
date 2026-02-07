export interface TripType {
  id: string;
  userId: string;
  name: string;
  startTime: Date;
  endTime: Date;
  totalDistance: number;
  totalDuration: number;
  totalIdlingDuration: number;
  totalStoppageDuration: number;
  overspeedDuration: number;
  overspeedDistance: number;
  createdAt: string;
  updatedAt: string;
}
