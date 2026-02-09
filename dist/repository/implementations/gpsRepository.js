"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPSRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const gpsSchema_1 = __importDefault(require("../../models/gpsSchema"));
class GPSRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(gpsSchema_1.default);
    }
    async insertMany(data) {
        await this.model.insertMany(data);
    }
    async deleteByTripIds(tripIds) {
        await this.model.deleteMany({ tripId: { $in: tripIds } });
    }
    async findByTripId(tripId) {
        return await this.model.find({ tripId });
    }
}
exports.GPSRepository = GPSRepository;
