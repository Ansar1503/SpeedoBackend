import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { ITokenService } from "./interfaces/iJwtServices";
import { TokenPayload } from "../types/authTypes";

@injectable()
export class TokenService implements ITokenService {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET!;
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET!;

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: "7d",
    });
  }
}
