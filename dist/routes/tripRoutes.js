"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../di/container");
const types_1 = require("../di/types");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const routeConstants_1 = require("../const/routeConstants");
const authenticationMiddleware_1 = require("../middlewares/authenticationMiddleware");
const routes = (0, express_1.Router)();
const tripController = container_1.container.get(types_1.TYPES.TripController);
routes.post(routeConstants_1.tripRoutes.upload, multerMiddleware_1.uploadCSV.single("file"), authenticationMiddleware_1.authenticate, (req, res, next) => {
    tripController.uploadTrip(req, res, next);
});
routes.get("/", authenticationMiddleware_1.authenticate, (req, res, next) => {
    tripController.getTrips(req, res, next);
});
routes.get("/:id", authenticationMiddleware_1.authenticate, (req, res, next) => {
    tripController.fetchTripDataById(req, res, next);
});
routes.delete("/", authenticationMiddleware_1.authenticate, (req, res, next) => {
    tripController.deleteTrips(req, res, next);
});
exports.default = routes;
