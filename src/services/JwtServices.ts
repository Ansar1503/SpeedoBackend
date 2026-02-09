import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { ITokenService } from "./interfaces/iJwtServices";
import { TokenPayload } from "../types/authTypes";
import { STATUSCODES } from "../const/statusCodes";
import { AppError } from "../errors/appError";

@injectable()
export class TokenService implements ITokenService {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET!;
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET!;

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: "1h",
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: "7d",
    });
  }
  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, this.refreshSecret) as {
        userId: string;
        email: string;
      };
    } catch {
      throw new AppError("Invalid refresh token", STATUSCODES.unauthorized);
    }
  }
}
