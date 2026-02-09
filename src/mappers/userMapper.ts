import { IUser } from "../models/userSchema";
import { UserType } from "../types/userType";

export const UserMapper = (user: IUser): UserType => {
  return {
    id: user._id?.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
};
