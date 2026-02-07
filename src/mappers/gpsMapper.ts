import { IGPSData } from "../models/gpsSchema";
import { GpsType } from "../types/gpsType";

export const GpsMapper = (gps: IGPSData): GpsType => ({
  id: gps._id.toString(),
  tripId: gps.tripId.toString(),
  latitude: gps.latitude,
  longitude: gps.longitude,
  timestamp: gps.timestamp,
  ignition: gps.ignition,
  speed: gps.speed,
});
