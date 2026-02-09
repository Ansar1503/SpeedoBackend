"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripMapper = void 0;
const TripMapper = (trip) => {
    return {
        id: trip._id.toString(),
        userId: trip.userId.toString(),
        name: trip.name,
        startTime: trip.startTime,
        endTime: trip.endTime,
        totalDistance: trip.totalDistance,
        totalDuration: trip.totalDuration,
        totalIdlingDuration: trip.totalIdlingDuration,
        totalStoppageDuration: trip.totalStoppageDuration,
        overspeedDuration: trip.overspeedDuration,
        overspeedDistance: trip.overspeedDistance,
        createdAt: trip.createdAt.toISOString(),
        updatedAt: trip.updatedAt.toISOString(),
    };
};
exports.TripMapper = TripMapper;
