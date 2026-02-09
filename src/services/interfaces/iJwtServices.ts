import { TokenPayload } from "../../types/authTypes";


export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
}
