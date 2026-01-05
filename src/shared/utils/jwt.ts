import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  } as SignOptions);
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  } as SignOptions);
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, env.jwtAccessSecret);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, env.jwtRefreshSecret);
};