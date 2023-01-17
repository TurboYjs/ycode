import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } = process.env;

export const redisStore = new Redis({
  port: Number(REDIS_PORT),
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
});
