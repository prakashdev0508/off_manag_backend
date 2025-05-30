"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccess = exports.createError = void 0;
const zod_1 = require("zod");
const errors_1 = require("./errors");
const createError = (status, message, error) => {
    // Handle Zod validation errors
    if (error instanceof zod_1.z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
            field: err.path[0] || 'unknown',
            message: err.message,
            path: err.path,
            code: err.code
        }));
        return new errors_1.ValidationError(JSON.stringify({
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
        return new errors_1.AppError(status, JSON.stringify({
            message,
            error: {
                name: error.name,
                message: error.message,
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            }
        }));
    }
    // Handle plain error messages
    return new errors_1.AppError(status, JSON.stringify({
        message,
        ...(error && { details: error })
    }));
};
exports.createError = createError;
const createSuccess = (res, message, data, status) => {
    return res
        .status(status ? status : 200)
        .json({ success: true, message: message, data });
};
exports.createSuccess = createSuccess;
