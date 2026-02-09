import { NextFunction, Request, Response } from "express";

export interface IAuthController {
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  signin(req: Request, res: Response, next: NextFunction): Promise<void>;
  refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
