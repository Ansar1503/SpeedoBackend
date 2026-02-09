"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distanceInMeters = distanceInMeters;
exports.speedKmPerHour = speedKmPerHour;
const geolib_1 = require("geolib");
function distanceInMeters(a, b) {
    return (0, geolib_1.getDistance)({ latitude: a.latitude, longitude: a.longitude }, { latitude: b.latitude, longitude: b.longitude });
}
function speedKmPerHour(distanceMeters, timeMs) {
    if (timeMs <= 0)
        return 0;
    const hours = timeMs / (1000 * 60 * 60);
    return distanceMeters / 1000 / hours;
}
