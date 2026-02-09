"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
// services/tripService.ts
const inversify_1 = require("inversify");
const appError_1 = require("../errors/appError");
const gpsCsvParser_1 = require("../utils/csv/gpsCsvParser");
const geolibUtils_1 = require("../utils/geolibUtils");
const types_1 = require("../di/types");
const statusCodes_1 = require("../const/statusCodes");
const tripAnalytics_1 = require("../utils/tripAnalytics");
const reverseGeoCode_1 = require("../utils/reverseGeoCode");
const tripMapper_1 = require("../mappers/tripMapper");
let TripService = class TripService {
    constructor(tripRepository, gpsRepository, userRepository) {
        this.tripRepository = tripRepository;
        this.gpsRepository = gpsRepository;
        this.userRepository = userRepository;
    }
    async uploadTrip(csvText, userId) {
        if (!csvText) {
            throw new appError_1.AppError("CSV content is empty", statusCodes_1.STATUSCODES.badRequest);
        }
        const existsUser = await this.userRepository.findById(userId);
        if (!existsUser) {
            throw new appError_1.AppError("User not found", statusCodes_1.STATUSCODES.notFound);
        }
        const contents = csvText.trim().replace(/\r\n/g, "\n").split("\n");
        const rows = contents.slice(1);
        const parsedRows = rows
            .map(gpsCsvParser_1.parseRow)
            .filter((row) => row !== null);
        const uniqueRows = new Map();
        for (const row of parsedRows) {
            const key = `${row.latitude}-${row.longitude}-${row.timestamp.toISOString()}`;
            uniqueRows.set(key, row);
        }
        const cleanedRows = Array.from(uniqueRows.values());
        if (cleanedRows.length === 0) {
            throw new appError_1.AppError("No valid GPS data found in CSV", statusCodes_1.STATUSCODES.badRequest);
        }
        const startPoint = cleanedRows[0];
        const endPoint = cleanedRows[cleanedRows.length - 1];
        const startTime = cleanedRows[0].timestamp;
        const endTime = cleanedRows[cleanedRows.length - 1].timestamp;
        const analytics = (0, tripAnalytics_1.calculateTripAnalytics)(cleanedRows);
        const fromPlace = await (0, reverseGeoCode_1.reverseGeocode)(startPoint.latitude, startPoint.longitude);
        const toPlace = await (0, reverseGeoCode_1.reverseGeocode)(endPoint.latitude, endPoint.longitude);
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
    async getTrips(userId, page, limit, search) {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new appError_1.AppError("User not found", statusCodes_1.STATUSCODES.notFound);
        }
        const { trips, total } = await this.tripRepository.findAllTrips(userId, page, limit, search);
        const mappedTrips = trips.map(tripMapper_1.TripMapper);
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
    async deleteTrips(userId, tripIds) {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new appError_1.AppError("User not found", statusCodes_1.STATUSCODES.notFound);
        }
        const existingTrips = await this.tripRepository.findByIds(tripIds);
        if (!existingTrips) {
            throw new appError_1.AppError("Trips not found", statusCodes_1.STATUSCODES.notFound);
        }
        await this.tripRepository.deleteByIds(tripIds);
        await this.gpsRepository.deleteByTripIds(tripIds);
    }
    async fetchTripDataById(userId, tripId) {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new appError_1.AppError("User not found", statusCodes_1.STATUSCODES.notFound);
        }
        const existingTrip = await this.tripRepository.findById(tripId);
        if (!existingTrip) {
            throw new appError_1.AppError("Trip not found", statusCodes_1.STATUSCODES.notFound);
        }
        if (existingTrip.userId.toString() !== userId) {
            throw new appError_1.AppError("Access denied", statusCodes_1.STATUSCODES.forbidden);
        }
        const gpsPoints = await this.gpsRepository.findByTripId(tripId);
        if (gpsPoints.length === 0) {
            throw new appError_1.AppError("No GPS data found", statusCodes_1.STATUSCODES.notFound);
        }
        const enrichedGpsPoints = [];
        for (let i = 0; i < gpsPoints.length - 1; i++) {
            const current = gpsPoints[i];
            const next = gpsPoints[i + 1];
            const timeDiffMs = new Date(next.timestamp).getTime() -
                new Date(current.timestamp).getTime();
            const distanceMeters = (0, geolibUtils_1.distanceInMeters)(current, next);
            const speed = (0, geolibUtils_1.speedKmPerHour)(distanceMeters, timeDiffMs);
            let status = "normal";
            if (current.ignition === "off") {
                status = "stopped";
            }
            else if (speed === 0) {
                status = "idle";
            }
            else if (speed > 60) {
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
};
exports.TripService = TripService;
exports.TripService = TripService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TripRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.GPSRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], TripService);
