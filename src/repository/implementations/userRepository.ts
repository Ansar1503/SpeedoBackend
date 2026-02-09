import { IUser } from "../../models/userSchema";
import { IUserRepository } from "../interface/iUserRepository";
import { BaseRepository } from "./baseRepository";
import UserModel from "../../models/userSchema";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

 async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email });
  }
}
