import {
  activationUser,
  getAuth,
  loginUser,
  logoutUser,
  refresh,
  registration,
} from '@/controllers';
import isAuthenticated from '@/middlewares/authMiddleware';
import { rateLimiter } from '@/middlewares/rateLimiter';
import { Router } from 'express';

const UserRoutes = Router();

UserRoutes.post('/register', rateLimiter(5, 60), registration);
UserRoutes.post('/activate-user', activationUser);
UserRoutes.post('/login', loginUser);
UserRoutes.post('/logout', isAuthenticated, logoutUser);
UserRoutes.get('/me', isAuthenticated, getAuth);
UserRoutes.get('/refresh-token', refresh);

export default UserRoutes;
