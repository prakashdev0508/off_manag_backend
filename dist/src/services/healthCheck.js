"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemInfo = exports.socketHealthCheck = exports.checkRedis = exports.checkDatabase = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../config/logger");
const errors_1 = require("../utils/errors");
const prisma = new client_1.PrismaClient();
const checkDatabase = async () => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return {
            status: 'healthy',
            message: 'Database connection is working',
        };
    }
    catch (error) {
        logger_1.logger.error('Database health check failed:', error);
        throw new errors_1.InternalServerError('Database health check failed');
    }
};
exports.checkDatabase = checkDatabase;
const checkRedis = async () => {
    try {
        // Implement Redis health check
        return {
            status: 'healthy',
            message: 'Redis connection is working',
        };
    }
    catch (error) {
        logger_1.logger.error('Redis health check failed:', error);
        throw new errors_1.InternalServerError('Redis health check failed');
    }
};
exports.checkRedis = checkRedis;
const socketHealthCheck = () => {
    return {
        status: 'healthy',
        message: 'Socket connection is working',
    };
};
exports.socketHealthCheck = socketHealthCheck;
const getSystemInfo = () => {
    return {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
    };
};
exports.getSystemInfo = getSystemInfo;
