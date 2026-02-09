"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const tripSchema_1 = __importDefault(require("../../models/tripSchema"));
const mongoose_1 = require("mongoose");
class TripRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(tripSchema_1.default);
    }
    async findAllTrips(userId, page, limit, search) {
        const skip = (page - 1) * limit;
        const query = {
            userId: new mongoose_1.Types.ObjectId(userId),
        };
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        const [trips, total] = await Promise.all([
            this.model.find(query).skip(skip).limit(limit).exec(),
            this.model.countDocuments(query),
        ]);
        return { trips, total };
    }
}
exports.TripRepository = TripRepository;
