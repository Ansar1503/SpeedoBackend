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
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
const statusCodes_1 = require("../const/statusCodes");
const appError_1 = require("../errors/appError");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(req, res, next) {
        try {
            const { name, email, password } = req.body;
            if (!name?.trim())
                throw new appError_1.AppError("name not found. enter a name");
            if (!email?.trim())
                throw new appError_1.AppError("email not found. enter a email");
            if (!password?.trim())
                throw new appError_1.AppError("password not found. please enter password");
            const result = await this.authService.signup({ name, email, password });
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(statusCodes_1.STATUSCODES.created).json({
                success: true,
                message: "Signup successful",
                accessToken: result.accessToken,
                data: result.user,
            });
            return;
        }
        catch (error) {
            next(error);
            return;
        }
    }
    async signin(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email?.trim())
                throw new appError_1.AppError("email not found. enter a email");
            if (!password?.trim())
                throw new appError_1.AppError("password not found. please enter password");
            const result = await this.authService.signin({ email, password });
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(statusCodes_1.STATUSCODES.success).json({
                success: true,
                message: "Signin successful",
                data: result.user,
                accessToken: result.accessToken,
            });
            return;
        }
        catch (error) {
            next(error);
            return;
        }
    }
    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                throw new appError_1.AppError("Refresh token missing", statusCodes_1.STATUSCODES.forbidden);
            }
            const accessToken = await this.authService.refresh(refreshToken);
            res.status(statusCodes_1.STATUSCODES.success).json({
                success: true,
                accessToken,
            });
            return;
        }
        catch (error) {
            console.log("error in refresh", error);
            next(error);
            return;
        }
    }
    async logout(req, res) {
        res.clearCookie("refreshToken", {
            path: "/api/auth/refresh",
        });
        res.status(statusCodes_1.STATUSCODES.success).json({
            success: true,
            message: "Logged out successfully",
        });
        return;
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AuthServices)),
    __metadata("design:paramtypes", [Object])
], AuthController);
