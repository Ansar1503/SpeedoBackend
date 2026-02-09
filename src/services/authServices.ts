import { inject, injectable } from "inversify";
import { AuthResult } from "../types/authTypes";
import { IAuthService } from "./interfaces/iAuthServices";
import { TYPES } from "../di/types";
import { ITokenService } from "./interfaces/iJwtServices";
import { IUserRepository } from "../repository/interface/iUserRepository";
import { AppError } from "../errors/appError";
import { UserMapper } from "../mappers/userMapper";
import { STATUSCODES } from "../const/statusCodes";
import bcrypt from "bcrypt";

@injectable()
export class AuthServices implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES.TokenService)
    private readonly _tokenService: ITokenService,
  ) {}
  async signin(data: { email: string; password: string }): Promise<AuthResult> {
    const existingUser = await this._userRepository.findByEmail(data.email);
    if (!existingUser)
      throw new AppError("User not found", STATUSCODES.notFound);
    const accessToken = await this._tokenService.generateAccessToken({
      email: existingUser.email,
      userId: existingUser._id?.toString(),
    });
    const refreshToken = await this._tokenService.generateRefreshToken({
      email: existingUser.email,
      userId: existingUser._id?.toString(),
    });
    const mappedUser = UserMapper(existingUser);
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
  async signup(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> {
    const existingUser = await this._userRepository.findByEmail(data.email);
    if (existingUser?.email === data.email)
      throw new AppError(
        "User existing on provided email. Try signing up using different email",
        STATUSCODES.badRequest,
      );
    const hashedPassword = await bcrypt.hash(data.password, 10);
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
    const mappedUser = UserMapper(createdUser);
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
}
