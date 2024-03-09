import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel, { IUser } from '@/models/userModel';
import CatchAsyncMiddleware from '@/middlewares/catchAsyncMiddleware';
import ErrorHandler from '@/configs/errorHandler';
import sendMail from '@/utils/sendMail';
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from '@/utils/jwt';
import { extractToken } from '@/middlewares/authMiddleware';
import { redis } from '@/utils/redis';
import { getUserById } from '@/services/userService';

dotenv.config();

interface IRegistrationBody
  extends Pick<IUser, 'username' | 'email' | 'password'> {
  avatar?: string;
}

// Register new user
export const registration = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        const error = new ErrorHandler(
          `The email ${email} has already been registered`,
          400
        );
        return error.sendErrorResponse(res);
      }

      const user: IRegistrationBody = {
        username,
        email,
        password,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      const data = {
        user: { username: user.username },
        activationCode,
        expiration: '5',
      };

      // Send mail with defined transport object
      await sendMail({
        email: user.email,
        subject: 'Activate your account!',
        template: 'activation-mail.ejs',
        data,
      });

      res.status(201).json({
        success: true,
        message: "We've sent you an email to activate your account.",
        activationToken: activationToken.token,
      });
    } catch (e: any) {
      const error = new ErrorHandler(e.message, e.statusCode || 500);
      return error.sendErrorResponse(res);
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9999).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: '5m' }
  );

  return { token, activationCode };
};

// Activate User
interface IActivationUser {
  activationToken: string;
  activationCode: string;
}

export const activationUser = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activationToken, activationCode } = req.body as IActivationUser;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activationToken,
        process.env.ACTIVATION_SECRET as Secret
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activationCode) {
        const error = new ErrorHandler('Invalid activation code', 400);
        return error.sendErrorResponse(res);
      }
      const { username, email, password } = newUser.user;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        const error = new ErrorHandler(
          `The email ${email} has already been registered`,
          400
        );
        return error.sendErrorResponse(res);
      }

      await userModel.create({
        username,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (e: any) {
      const error = new ErrorHandler(e.message, e.statusCode || 500);
      return error.sendErrorResponse(res);
    }
  }
);

// Login user
interface ILoginUser {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginUser;

      if (!email || !password) {
        const error = new ErrorHandler('Please enter email and password', 400);
        return error.sendErrorResponse(res);
      }

      const user = await userModel.findOne({ email }).select('+password');
      if (!user) {
        const error = new ErrorHandler('Invalid credentails.', 400);
        return error.sendErrorResponse(res);
      }

      if (user.isVerified) {
        const error = new ErrorHandler('Please activate your account.', 400);
        return error.sendErrorResponse(res);
      }

      const isCorrectPassword = await user.comparePassword(password);
      if (!isCorrectPassword) {
        const error = new ErrorHandler('Password field is incorrect.', 400);
        return error.sendErrorResponse(res);
      }

      const userWithoutPassword = new userModel({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        courses: user.courses,
      });

      sendToken(userWithoutPassword as IUser, 200, res);
    } catch (e: any) {
      const error = new ErrorHandler(e.message, e.statusCode || 500);
      return error.sendErrorResponse(res);
    }
  }
);

export const logoutUser = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });
      res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    } catch (e: any) {
      const error = new ErrorHandler(e.message, e.statusCode);
      return error.sendErrorResponse(res);
    }
  }
);

// refresh token
export const refresh = CatchAsyncMiddleware(
  async (req: Request, res: Response) => {
    try {
      const refresh_token =
        (req.cookies.refresh_token as string) ||
        extractToken(req.headers.refresh_token as string);

      if (!refresh_token) {
        const error = new ErrorHandler('Refresh token is not found.', 401);
        return error.sendErrorResponse(res);
      }

      const decode = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as Secret
      ) as JwtPayload;

      if (!decode) {
        const error = new ErrorHandler('Unauthorize.', 401);
        return error.sendErrorResponse(res);
      }

      const session = await redis.get(decode.sub as string); // get the user info from Redis by id

      if (!session) {
        const error = new ErrorHandler('The request is invalid session.', 500);
        return error.sendErrorResponse(res);
      }

      const user = JSON.parse(session);

      const payload = {
        sub: user._id,
        username: user.username,
      };

      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as Secret,
        {
          expiresIn: '5m',
        }
      );

      const refresToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET as Secret,
        {
          expiresIn: '3day',
        }
      );

      res.cookie('access_token', accessToken, accessTokenOptions);
      res.cookie('resfres_token', refresToken, refreshTokenOptions);

      res.status(200).json({ success: true, accessToken });
    } catch (e: any) {
      const error = new ErrorHandler(e.message, e.status || 400);
      return error.sendErrorResponse(res);
    }
  }
);

// Get current auth
export const getAuth = CatchAsyncMiddleware(
  async (req: Request, res: Response) => {
    try {
      const user = await getUserById(req.user!._id, res);

      if (!user) {
        const error = new ErrorHandler('You are not logged in', 401);
        return error.sendErrorResponse(res);
      }

      res.status(201).json({
        success: true,
        user,
      });
    } catch (e: any) {
      const error = new ErrorHandler(e.message, e.status || 400);
      return error.sendErrorResponse(res);
    }
  }
);
