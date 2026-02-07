import { IUser } from "../../models/userSchema";
import { IBaseRepository } from "./iBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
