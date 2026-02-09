// services/tripService.ts
import { inject, injectable } from "inversify";
import { ITripService } from "./interfaces/iTripServices";
import { AppError } from "../errors/appError";
import { ParsedGPSRow, parseRow } from "../utils/csv/gpsCsvParser";
import { ITripRepository } from "../repository/interface/iTripInterface";
import { IGPSRepository } from "../repository/interface/iGpsRepository";
import { TYPES } from "../di/types";

@injectable()
export class TripService implements ITripService {
  constructor(
    @inject(TYPES.TripRepository)
    private readonly tripRepository: ITripRepository,
    @inject(TYPES.GPSRepository)
    private readonly gpsRepository: IGPSRepository,
  ) {}

  async uploadTrip(csvText: string): Promise<void> {
    if (!csvText) {
      throw new AppError("CSV content is empty", 400);
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
      throw new AppError("No valid GPS data found in CSV", 400);
    }
    const startTime = cleanedRows[0].timestamp;
    const endTime = cleanedRows[cleanedRows.length - 1].timestamp;
    const gpsDocs = cleanedRows.map((row) => ({
      tripId: trip._id,
      latitude: row.latitude,
      longitude: row.longitude,
      timestamp: row.timestamp,
      ignition: row.ignition,
      speed: 0,
    }));

    const trip = await this.tripRepository.create({
      name: `Trip ${new Date().toISOString()}`,
      startTime,
      endTime,
    });
  }

  async getTrips(): Promise<any[]> {
    return [];
  }
}
