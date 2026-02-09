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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
const appError_1 = require("../errors/appError");
const userMapper_1 = require("../mappers/userMapper");
const statusCodes_1 = require("../const/statusCodes");
const bcrypt_1 = __importDefault(require("bcrypt"));
let AuthServices = class AuthServices {
    constructor(_userRepository, _tokenService) {
        this._userRepository = _userRepository;
        this._tokenService = _tokenService;
    }
    async signin(data) {
        const existingUser = await this._userRepository.findByEmail(data.email);
        if (!existingUser)
            throw new appError_1.AppError("User not found", statusCodes_1.STATUSCODES.notFound);
        const accessToken = await this._tokenService.generateAccessToken({
            email: existingUser.email,
            userId: existingUser._id?.toString(),
        });
        const refreshToken = await this._tokenService.generateRefreshToken({
            email: existingUser.email,
            userId: existingUser._id?.toString(),
        });
        const mappedUser = (0, userMapper_1.UserMapper)(existingUser);
        return {
            accessToken: accessToken,
            refreshToken,
            user: {
                email: mappedUser.email,
                name: mappedUser.name,
                id: mappedUser.id,
            },
        };
    }
    async signup(data) {
        const existingUser = await this._userRepository.findByEmail(data.email);
        if (existingUser?.email === data.email)
            throw new appError_1.AppError("User existing on provided email. Try signing up using different email", statusCodes_1.STATUSCODES.badRequest);
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const createdUser = await this._userRepository.create({
            email: data.email,
            name: data.name,
            password: hashedPassword,
        });
        const accessToken = await this._tokenService.generateAccessToken({
            email: createdUser.email,
            userId: createdUser._id?.toString(),
        });
        const refreshToken = await this._tokenService.generateRefreshToken({
            email: createdUser.email,
            userId: createdUser._id?.toString(),
        });
        const mappedUser = (0, userMapper_1.UserMapper)(createdUser);
        return {
            accessToken: accessToken,
            refreshToken,
            user: {
                email: mappedUser.email,
                name: mappedUser.name,
                id: mappedUser.id,
            },
        };
    }
    async refresh(refreshToken) {
        const payload = this._tokenService.verifyRefreshToken(refreshToken);
        const user = await this._userRepository.findById(payload.userId);
        if (!user) {
            throw new appError_1.AppError("Invalid refresh token", statusCodes_1.STATUSCODES.unauthorized);
        }
        return this._tokenService.generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
        });
    }
};
exports.AuthServices = AuthServices;
exports.AuthServices = AuthServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TokenService)),
    __metadata("design:paramtypes", [Object, Object])
], AuthServices);
