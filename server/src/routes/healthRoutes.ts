import { rateLimiter } from '@/middlewares/rateLimiter';
import { NextFunction, Router, Request, Response } from 'express';

const healthRoutes = Router();

healthRoutes.get('/', (req, res) => {
  const status = 'UP';
  return res.status(200).json({ status });
});

healthRoutes.get(
  '/ratelimiter',
  rateLimiter(5, 10),
  (req: Request, res: Response) => {
    res.status(200).json({
      callsInAMinute: (req as any).requsets,
    });
  }
);

export default healthRoutes;
