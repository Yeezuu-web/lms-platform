import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel, { IUser } from '@/models/userModel';
import CatchAsyncMiddleware from '@/middlewares/catchAsyncMiddleware';
import ErrorHandler from '@/configs/errorHandler';
import sendMail from '@/utils/sendMail';
import { sendToken } from '@/utils/jwt';
dotenv.config();

interface IRegistrationBody
  extends Pick<IUser, 'username' | 'email' | 'password'> {
  avatar?: string;
}

// Register new user
export const registration = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
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

    try {
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
      const error = new ErrorHandler(e.message, 400);
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
  }
);

// Login user
interface ILoginUser {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
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

    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) {
      const error = new ErrorHandler('Password field is incorrect.', 400);
      return error.sendErrorResponse(res);
    }

    sendToken(user, 200, res);
  }
);

export const logoutUser = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
);
