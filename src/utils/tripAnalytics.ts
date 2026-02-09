import { getDistance } from "geolib";
import { ParsedGPSRow } from "./csv/gpsCsvParser";

export interface TripAnalyticsResult {
  totalDistance: number;
  totalDuration: number;
  totalIdlingDuration: number;
  totalStoppageDuration: number;
  overspeedDuration: number;
  overspeedDistance: number;
  speeds: number[];
}

export const calculateTripAnalytics = (
  rows: ParsedGPSRow[],
): TripAnalyticsResult => {
  let totalDistance = 0;
  let totalIdlingDuration = 0;
  let totalStoppageDuration = 0;
  let overspeedDuration = 0;
  let overspeedDistance = 0;

  const speeds: number[] = [];

  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1];
    const curr = rows[i];

    const timeDiff =
      (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000;
    if (timeDiff <= 0) {
      speeds.push(0);
      continue;
    }

    const distance = getDistance(
      { latitude: prev.latitude, longitude: prev.longitude },
      { latitude: curr.latitude, longitude: curr.longitude },
    );

    const speed = (distance / timeDiff) * 3.6;

    totalDistance += distance;
    speeds.push(speed);

    if (prev.ignition === "off") {
      totalStoppageDuration += timeDiff;
    }

    if (prev.ignition === "on" && distance === 0) {
      totalIdlingDuration += timeDiff;
    }

    if (speed > 60) {
      overspeedDuration += timeDiff;
      overspeedDistance += distance;
    }
  }

  const totalDuration =
    (rows[rows.length - 1].timestamp.getTime() - rows[0].timestamp.getTime()) /
    1000;

  return {
    totalDistance,
    totalDuration,
    totalIdlingDuration,
    totalStoppageDuration,
    overspeedDuration,
    overspeedDistance,
    speeds,
  };
};
