"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const UserMapper = (user) => {
    return {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
    };
};
exports.UserMapper = UserMapper;
