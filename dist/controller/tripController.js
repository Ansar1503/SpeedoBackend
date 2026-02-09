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
exports.TripController = void 0;
const inversify_1 = require("inversify");
const appError_1 = require("../errors/appError");
const statusCodes_1 = require("../const/statusCodes");
const types_1 = require("../di/types");
let TripController = class TripController {
    constructor(_tripServices) {
        this._tripServices = _tripServices;
    }
    async uploadTrip(req, res, next) {
        try {
            if (!req.file) {
                throw new appError_1.AppError("CSV file is required", statusCodes_1.STATUSCODES.badRequest);
            }
            const userId = req.user?.userId;
            const csvText = req.file.buffer.toString("utf-8");
            await this._tripServices.uploadTrip(csvText, userId);
            res.status(statusCodes_1.STATUSCODES.created).json({
                success: true,
                message: "trip data uploaded successfully",
            });
            return;
        }
        catch (error) {
            console.log("error in upload trip", error);
            next(error);
            return;
        }
    }
    async getTrips(req, res, next) {
        try {
            const userId = req.user?.userId;
            let { page, limit, search } = req.query;
            const result = await this._tripServices.getTrips(userId, isNaN(Number(page)) ? 1 : Number(page), isNaN(Number(limit)) ? 10 : Number(limit), typeof search === "string" ? search : "");
            res.status(statusCodes_1.STATUSCODES.success).json({
                success: true,
                data: result.data,
                pagination: result.pagination,
            });
            return;
        }
        catch (error) {
            next(error);
            return;
        }
    }
    async deleteTrips(req, res, next) {
        try {
            const userId = req.user?.userId;
            const { tripIds } = req.body;
            if (!Array.isArray(tripIds) || tripIds.length === 0) {
                throw new appError_1.AppError("Trip IDs are required", statusCodes_1.STATUSCODES.badRequest);
            }
            await this._tripServices.deleteTrips(userId, tripIds);
            res.status(statusCodes_1.STATUSCODES.success).json({
                success: true,
                message: "Trips deleted successfully",
            });
            return;
        }
        catch (error) {
            next(error);
            return;
        }
    }
    async fetchTripDataById(req, res, next) {
        try {
            const userId = req.user?.userId;
            const { id } = req.params;
            if (!id) {
                throw new appError_1.AppError("Trip ID is required", statusCodes_1.STATUSCODES.badRequest);
            }
            const result = await this._tripServices.fetchTripDataById(userId, Array.isArray(id) ? id[0] : id);
            res.status(statusCodes_1.STATUSCODES.success).json({
                success: true,
                data: result,
            });
            return;
        }
        catch (error) {
            next(error);
            return;
        }
    }
};
exports.TripController = TripController;
exports.TripController = TripController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TripService)),
    __metadata("design:paramtypes", [Object])
], TripController);
