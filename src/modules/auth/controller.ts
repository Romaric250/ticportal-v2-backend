import type { Request, Response } from "express";
import { AuthService } from "./service";
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from "./types";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const input = RegisterSchema.parse(req.body);
      const result = await AuthService.register(input);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: { message: (error as Error).message } });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const input = LoginSchema.parse(req.body);
      const result = await AuthService.login(input);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(401).json({ success: false, error: { message: (error as Error).message } });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const input = RefreshTokenSchema.parse(req.body);
      const result = await AuthService.refreshToken(input.refreshToken);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(401).json({ success: false, error: { message: (error as Error).message } });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.body.refreshToken;
      await AuthService.logout(token);
      res.json({ success: true, message: "Logged out" });
    } catch (error) {
      res.status(400).json({ success: false, error: { message: (error as Error).message } });
    }
  }
}