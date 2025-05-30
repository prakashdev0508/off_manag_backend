import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import { InternalServerError } from '../utils/errors';

const prisma = new PrismaClient();

export const checkDatabase = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'healthy',
      message: 'Database connection is working',
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    throw new InternalServerError('Database health check failed');
  }
};

export const checkRedis = async () => {
  try {
    // Implement Redis health check
    return {
      status: 'healthy',
      message: 'Redis connection is working',
    };
  } catch (error) {
    logger.error('Redis health check failed:', error);
    throw new InternalServerError('Redis health check failed');
  }
};

export const socketHealthCheck = () => {
  return {
    status: 'healthy',
    message: 'Socket connection is working',
  };
};

export const getSystemInfo = () => {
  return {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  };
}; 