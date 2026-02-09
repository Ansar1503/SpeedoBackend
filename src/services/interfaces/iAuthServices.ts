import { AuthResult } from "../../types/authTypes";

export interface IAuthService {
  signup(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult>;

  signin(data: { email: string; password: string }): Promise<AuthResult>;
  refresh(refreshToken: string): Promise<string>;
}
