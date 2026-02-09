import { getDistance } from "geolib";

export function distanceInMeters(a: any, b: any) {
  return getDistance(
    { latitude: a.latitude, longitude: a.longitude },
    { latitude: b.latitude, longitude: b.longitude },
  );
}

export function speedKmPerHour(distanceMeters: number, timeMs: number) {
  if (timeMs <= 0) return 0;
  const hours = timeMs / (1000 * 60 * 60);
  return distanceMeters / 1000 / hours;
}
