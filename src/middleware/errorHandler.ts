import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error(err.message);

    try {
      const errorData = JSON.parse(err.message);
      res.status(err.statusCode).json({
        status: 'error',
        ...errorData
      });
    } catch {
      res.status(err.statusCode).json({
        status: 'error',
        message: err.message
      });
    }
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    logger.error('Database operation failed');

    res.status(400).json({
      status: 'error',
      message: 'Database operation failed',
      ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    logger.error(err.message);

    res.status(400).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    logger.error('Invalid token');

    res.status(401).json({
      status: 'error',
      message: 'Invalid token',
    });
    return;
  }

  // Handle all other errors
  logger.error('Internal server error');

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}; 