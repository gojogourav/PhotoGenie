import { Redis } from "@upstash/redis"
console.log("This is url",process.env.UPSTASH_REDIS_REST_URL);
console.log("This is token",process.env.UPSTASH_REDIS_REST_TOKEN);
console.log("This is token",process.env.CLOUDINARY_CLOUD_NAME);

export const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,

});
