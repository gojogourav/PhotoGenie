import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";
import { redisClient } from "../utils/redisClient";
// console.log( "url:", process.env.UPSTASH_REDIS_REST_URLy,"\ntoken", process.env.UPSTASH_REDIS_REST_TOKEN);

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rl_global",
    points: 100,
    duration: 60,
    blockDuration: 60 * 5,
    execEvenly: false,
})

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let ip: string | undefined;
        const forwardedFor = req.headers['x-forwarded-for'];
        ip = typeof forwardedFor === 'string' ? forwardedFor.split(',').shift()?.trim() : req.socket.remoteAddress;
        console.log("is this working 3");


        if (!ip) {
            throw new Error("Error could not figure out ip")
        }

        const rateLimiterRes = await rateLimiter.consume(ip, 10);

        res.set({
            "RateLimit-Limit": rateLimiter.points,
            "RateLimit-Remaining": rateLimiterRes.remainingPoints,
            "RateLimit-Reset": Math.ceil(rateLimiterRes.msBeforeNext / 1000),
        });

        next();
    } catch (error) {
        if (error instanceof RateLimiterRes) {
            const retryAfterSec = Math.ceil(error.msBeforeNext / 1000);

            res.setHeader("Retry-After", retryAfterSec.toString());
            res.status(429).json({
                error: "Too Many Requests",
                message: `Try again in ${retryAfterSec} seconds`,
                retryAfter: retryAfterSec,
            });
            return;
        }
        console.error(error);

        console.error("Rate limiter error:", error);
        next();
    }
}