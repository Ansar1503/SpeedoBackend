// services/tripService.ts
import { inject, injectable } from "inversify";
import { ITripService } from "./interfaces/iTripServices";
import { AppError } from "../errors/appError";
import { ParsedGPSRow, parseRow } from "../utils/csv/gpsCsvParser";
import { ITripRepository } from "../repository/interface/iTripInterface";
import { IGPSRepository } from "../repository/interface/iGpsRepository";
import { distanceInMeters, speedKmPerHour } from "../utils/geolibUtils";
import { TYPES } from "../di/types";
import { IUserRepository } from "../repository/interface/iUserRepository";
import { STATUSCODES } from "../const/statusCodes";
import { calculateTripAnalytics } from "../utils/tripAnalytics";
import { reverseGeocode } from "../utils/reverseGeoCode";
import { TripMapper } from "../mappers/tripMapper";
import { FetchTripResponse } from "../types/tripType";

@injectable()
export class TripService implements ITripService {
  constructor(
    @inject(TYPES.TripRepository)
    private readonly tripRepository: ITripRepository,
    @inject(TYPES.GPSRepository)
    private readonly gpsRepository: IGPSRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async uploadTrip(csvText: string, userId: string): Promise<void> {
    if (!csvText) {
      throw new AppError("CSV content is empty", STATUSCODES.badRequest);
    }
    const existsUser = await this.userRepository.findById(userId);
    if (!existsUser) {
      throw new AppError("User not found", STATUSCODES.notFound);
    }
    const contents = csvText.trim().replace(/\r\n/g, "\n").split("\n");

    const rows = contents.slice(1);

    const parsedRows = rows
      .map(parseRow)
      .filter((row): row is ParsedGPSRow => row !== null);

    const uniqueRows = new Map<string, ParsedGPSRow>();

    for (const row of parsedRows) {
      const key = `${row.latitude}-${row.longitude}-${row.timestamp.toISOString()}`;
      uniqueRows.set(key, row);
    }

    const cleanedRows = Array.from(uniqueRows.values());

    if (cleanedRows.length === 0) {
      throw new AppError(
        "No valid GPS data found in CSV",
        STATUSCODES.badRequest,
      );
    }
    const startPoint = cleanedRows[0];
    const endPoint = cleanedRows[cleanedRows.length - 1];
    const startTime = cleanedRows[0].timestamp;
    const endTime = cleanedRows[cleanedRows.length - 1].timestamp;
    const analytics = calculateTripAnalytics(cleanedRows);

    const fromPlace = await reverseGeocode(
      startPoint.latitude,
      startPoint.longitude,
    );

    const toPlace = await reverseGeocode(endPoint.latitude, endPoint.longitude);

    const tripName = `${fromPlace} → ${toPlace}`;
    const trip = await this.tripRepository.create({
      userId: existsUser._id,
      name: tripName,
      startTime,
      endTime,
      totalDistance: analytics.totalDistance,
      totalDuration: analytics.totalDuration,
      totalIdlingDuration: analytics.totalIdlingDuration,
      totalStoppageDuration: analytics.totalStoppageDuration,
      overspeedDuration: analytics.overspeedDuration,
      overspeedDistance: analytics.overspeedDistance,
    });
    const gpsDocs = cleanedRows.map((row, index) => ({
      tripId: trip._id,
      latitude: row.latitude,
      longitude: row.longitude,
      timestamp: row.timestamp,
      ignition: row.ignition,
      speed: analytics.speeds[index] || 0,
    }));
    await this.gpsRepository.insertMany(gpsDocs);
  }

  async getTrips(userId: string, page: number, limit: number, search: string) {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new AppError("User not found", STATUSCODES.notFound);
    }

    const { trips, total } = await this.tripRepository.findAllTrips(
      userId,
      page,
      limit,
      search,
    );
    const mappedTrips = trips.map(TripMapper);
    return {
      data: mappedTrips,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async deleteTrips(userId: string, tripIds: string[]): Promise<void> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new AppError("User not found", STATUSCODES.notFound);
    }
    const existingTrips = await this.tripRepository.findByIds(tripIds);
    if (!existingTrips) {
      throw new AppError("Trips not found", STATUSCODES.notFound);
    }
    await this.tripRepository.deleteByIds(tripIds);
    await this.gpsRepository.deleteByTripIds(tripIds);
  }
  async fetchTripDataById(
    userId: string,
    tripId: string,
  ): Promise<FetchTripResponse> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new AppError("User not found", STATUSCODES.notFound);
    }

    const existingTrip = await this.tripRepository.findById(tripId);
    if (!existingTrip) {
      throw new AppError("Trip not found", STATUSCODES.notFound);
    }

    if (existingTrip.userId.toString() !== userId) {
      throw new AppError("Access denied", STATUSCODES.forbidden);
    }

    const gpsPoints = await this.gpsRepository.findByTripId(tripId);

    if (gpsPoints.length === 0) {
      throw new AppError("No GPS data found", STATUSCODES.notFound);
    }
    type GPSPointResponse = FetchTripResponse["gpsPoints"][number];

    const enrichedGpsPoints: GPSPointResponse[] = [];

    for (let i = 0; i < gpsPoints.length - 1; i++) {
      const current = gpsPoints[i];
      const next = gpsPoints[i + 1];

      const timeDiffMs =
        new Date(next.timestamp).getTime() -
        new Date(current.timestamp).getTime();

      const distanceMeters = distanceInMeters(current, next);
      const speed = speedKmPerHour(distanceMeters, timeDiffMs);

      let status: "stopped" | "idle" | "overspeed" | "normal" = "normal";

      if (current.ignition === "off") {
        status = "stopped";
      } else if (speed === 0) {
        status = "idle";
      } else if (speed > 60) {
        status = "overspeed";
      }

      enrichedGpsPoints.push({
        latitude: current.latitude,
        longitude: current.longitude,
        timestamp: current.timestamp,
        ignition: current.ignition,
        speed: Math.round(speed),
        status,
      });
    }

    const last = gpsPoints[gpsPoints.length - 1];
    enrichedGpsPoints.push({
      latitude: last.latitude,
      longitude: last.longitude,
      timestamp: last.timestamp,
      ignition: last.ignition,
      speed: 0,
      status: last.ignition === "off" ? "stopped" : "idle",
    });

    return {
      trip: {
        _id: existingTrip._id.toString(),
        name: existingTrip.name,
        startTime: existingTrip.startTime,
        endTime: existingTrip.endTime,
        totalDistance: existingTrip.totalDistance,
        totalDuration: existingTrip.totalDuration,
        totalIdlingDuration: existingTrip.totalIdlingDuration,
        totalStoppageDuration: existingTrip.totalStoppageDuration,
        overspeedDuration: existingTrip.overspeedDuration,
        overspeedDistance: existingTrip.overspeedDistance,
      },
      gpsPoints: enrichedGpsPoints,
    };
  }
}
