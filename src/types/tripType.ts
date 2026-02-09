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

export interface FetchTripResponse {
  trip: {
    _id: string;
    name: string;
    startTime: Date;
    endTime: Date;
    totalDistance: number;
    totalDuration: number;
    totalIdlingDuration: number;
    totalStoppageDuration: number;
    overspeedDuration: number;
    overspeedDistance: number;
  };
  gpsPoints: Array<{
    latitude: number;
    longitude: number;
    timestamp: Date;
    ignition: "on" | "off";
    speed: number;
    status: "stopped" | "idle" | "overspeed" | "normal";
  }>;
}
