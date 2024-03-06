import ErrorHandler from '@/configs/errorHandler';
import userModel from '@/models/userModel';
import { Response } from 'express';

export const getUserById = async (id: string, res: Response) => {
  try {
    const user = userModel.findById(id);

    if (!user) {
      const error = new ErrorHandler('User not found.', 400);
      return error.sendErrorResponse(res);
    }

    return user;
  } catch (e: any) {
    const error = new ErrorHandler(e.messagae, e.status || 500);
    return error.sendErrorResponse(e);
  }
};
