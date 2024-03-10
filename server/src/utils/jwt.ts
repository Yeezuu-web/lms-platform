import { IUser } from '@/models/userModel';
import * as dotenv from 'dotenv';
import { Response } from 'express';
import { redis } from './redis';
dotenv.config();

interface ITokenOption {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean;
}

const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXP || '5', 10);

const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXP || '2', 10);

export const accessTokenOptions: ITokenOption = {
  expires: new Date(Date.now() + accessTokenExpires * 60 * 60 * 1000),
  maxAge: refreshTokenExpires * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
};

export const refreshTokenOptions: ITokenOption = {
  expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Redis store user_id
  redis.set(user._id, JSON.stringify(user) as any);

  if (process.env.NODE_ENV === 'production') {
    accessTokenOptions.secure = true;
  }

  res.cookie('access_token', accessToken, accessTokenOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
