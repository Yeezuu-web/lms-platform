import CatchAsyncMiddleware from '@/middlewares/catchAsyncMiddleware';
import { redis } from '@/utils/redis';
import { NextFunction, Request, Response } from 'express';
import { RedisKey } from 'ioredis';
import IP from 'ip';

export const rateLimiter = (rateLimit: number, timeFrame?: number) => {
  return CatchAsyncMiddleware(
    async (req: Request, res: Response, next: NextFunction) => {
      const ip =
        req.connection.remoteAddress ||
        IP.address() ||
        req.socket.remoteAddress;

      const requests = await redis.incr(ip as RedisKey);
      let ttl;
      if (requests === 1) {
        await redis.expire(ip as RedisKey, timeFrame || 60); // Default to one minute if no time frame is provided
        ttl = timeFrame ? timeFrame : 60;
      } else {
        ttl = await redis.ttl(ip as RedisKey);
      }

      if (requests > rateLimit) {
        res.status(503).json({
          message: `Too many requests`,
          callsInAMinute: requests,
          ttl,
        });
      } else {
        (req as any).requests = requests;
        (req as any).ttl = ttl;
        next();
      }
    }
  );
};
