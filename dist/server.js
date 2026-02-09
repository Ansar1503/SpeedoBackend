"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
require("reflect-metadata");
const databse_1 = __importDefault(require("./config/databse"));
const errorHandlingMiddleware_1 = require("./middlewares/errorHandlingMiddleware");
const routeConstants_1 = require("./const/routeConstants");
const tripRoutes_1 = __importDefault(require("./routes/tripRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = process.env.PORT || 8000;
const FrontendApi = process.env.FRONTEND_API || "http://localhost:3000";
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [FrontendApi],
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(`${routeConstants_1.api}${routeConstants_1.tripRoutes.trips}`, tripRoutes_1.default);
app.use(`${routeConstants_1.api}${routeConstants_1.authRoutes.auth}`, authRoutes_1.default);
app.use(errorHandlingMiddleware_1.errorHandler);
const start = async () => {
    await (0, databse_1.default)();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};
start();
