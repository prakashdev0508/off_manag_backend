"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = require("../config/logger");
const errorHandler = (err, req, res, next) => {
    if (err instanceof errors_1.AppError) {
        logger_1.logger.error(err.message);
        try {
            const errorData = JSON.parse(err.message);
            res.status(err.statusCode).json({
                status: 'error',
                ...errorData
            });
        }
        catch {
            res.status(err.statusCode).json({
                status: 'error',
                message: err.message
            });
        }
        return;
    }
    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        logger_1.logger.error('Database operation failed');
        res.status(400).json({
            status: 'error',
            message: 'Database operation failed',
            ...(process.env.NODE_ENV === 'development' && { details: err.message }),
        });
        return;
    }
    // Handle validation errors
    if (err.name === 'ValidationError') {
        logger_1.logger.error(err.message);
        res.status(400).json({
            status: 'error',
            message: err.message,
        });
        return;
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        logger_1.logger.error('Invalid token');
        res.status(401).json({
            status: 'error',
            message: 'Invalid token',
        });
        return;
    }
    // Handle all other errors
    logger_1.logger.error('Internal server error');
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
