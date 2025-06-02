import Redis from "ioredis";
export const redisClient = new Redis(process.env.UPSTASH_API_KEY || 'redis://localhost:6379');
redisClient
  .on('connect', () => console.log('Redis connected'))
  .on('ready', () => console.log('Redis ready'))
  .on('error', err => console.error('BullMQ Redis Error:', err))
  .on('reconnecting', () => console.log('Redis reconnecting...'))
  .on('end', () => console.log('Redis connection closed'));
