"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../errors/appError");
const statusCodes_1 = require("../const/statusCodes");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof appError_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err.name === "MulterError") {
        res.status(statusCodes_1.STATUSCODES.badRequest).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err.message) {
        res.status(statusCodes_1.STATUSCODES.badRequest).json({ success: false, message: err.message });
        return;
    }
    console.error("❌ Unexpected Error:", err);
    res.status(statusCodes_1.STATUSCODES.internalServerError).json({
        success: false,
        message: "Internal server error",
    });
    return;
};
exports.errorHandler = errorHandler;
