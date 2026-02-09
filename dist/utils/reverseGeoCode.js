"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseGeocode = void 0;
const axios_1 = __importDefault(require("axios"));
const reverseGeocode = async (latitude, longitude) => {
    const response = await axios_1.default.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
            lat: latitude,
            lon: longitude,
            format: "json",
        },
        headers: {
            "User-Agent": "vehicle-tracking-app",
        },
    });
    const address = response.data.address;
    return (address?.road ||
        address?.suburb ||
        address?.city ||
        address?.town ||
        address?.village ||
        "Unknown location");
};
exports.reverseGeocode = reverseGeocode;
