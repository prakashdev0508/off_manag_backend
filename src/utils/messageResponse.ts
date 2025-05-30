import { Response } from "express";
import { z } from "zod";
import { AppError, ValidationError } from "./errors";

interface ZodValidationError {
  field: string | number;
  message: string;
  path?: (string | number)[];
  code?: string;
}

export const createError = (status: number, message: string, error?: any) => {
  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const formattedErrors: ZodValidationError[] = error.errors.map((err) => ({
      field: err.path[0] || 'unknown',
      message: err.message,
      path: err.path,
      code: err.code
    }));

    return new ValidationError(JSON.stringify({
      message: "Validation failed",
      errors: formattedErrors,
      details: {
        errorCount: error.errors.length,
        issues: error.errors.map(err => ({
          code: err.code,
          path: err.path,
          message: err.message
        }))
      }
    }));
  }

  // Handle other types of errors
  if (error instanceof Error) {
    return new AppError(status, JSON.stringify({
      message,
      error: {
        name: error.name,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    }));
  }

  // Handle plain error messages
  return new AppError(status, JSON.stringify({
    message,
    ...(error && { details: error })
  }));
};

export const createSuccess = (
  res: Response,
  message: string,
  data?: any,
  status?: number
) => {
  return res
    .status(status ? status : 200)
    .json({ success: true, message: message, data });
};
