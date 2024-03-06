import {
  activationUser,
  loginUser,
  logoutUser,
  refresh,
  registration,
} from '@/controllers';
import isAuthenticated from '@/middlewares/authMiddleware';
import { Router } from 'express';

const UserRoutes = Router();

UserRoutes.post('/register', registration);
UserRoutes.post('/activate-user', activationUser);
UserRoutes.post('/login', loginUser);
UserRoutes.post('/logout', isAuthenticated, logoutUser);
UserRoutes.post('/refresh-token', refresh);

export default UserRoutes;
