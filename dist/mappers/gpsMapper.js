"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GpsMapper = void 0;
const GpsMapper = (gps) => ({
    id: gps._id.toString(),
    tripId: gps.tripId.toString(),
    latitude: gps.latitude,
    longitude: gps.longitude,
    timestamp: gps.timestamp,
    ignition: gps.ignition,
    speed: gps.speed,
});
exports.GpsMapper = GpsMapper;
