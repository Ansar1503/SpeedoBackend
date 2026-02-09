"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const userSchema_1 = __importDefault(require("../../models/userSchema"));
class UserRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(userSchema_1.default);
    }
    async findByEmail(email) {
        return await this.model.findOne({ email });
    }
}
exports.UserRepository = UserRepository;
