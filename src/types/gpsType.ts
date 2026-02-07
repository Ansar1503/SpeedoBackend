export interface GpsType {
  id: string;
  tripId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: "on" | "off";
  speed: number;
}
