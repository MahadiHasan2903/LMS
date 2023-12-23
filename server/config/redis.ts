import { Redis } from "ioredis";

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("Redis Connected".bgMagenta.black);
    return process.env.REDIS_URL;
  }
  throw new Error("Redis Connection Failed".bgRed.white);
};

export const redis = new Redis(redisClient());
