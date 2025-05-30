import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getAccssToken } from "../../services/external/mainbackend/authApis";
import { prisma } from "../../config/db/dbconfig";
import { createError, createSuccess } from "../../utils/messageResponse";
import { registerSchema } from "../../schema/auth.schema";

/**
 * @access Public
 * @route POST /auth/login
 * @description Login with Google ID Token
 * @returns {object} - User data and token
 */

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { googleIdToken } = req.body;

    if (!googleIdToken) {
      return next(createError(400, "Google ID Token is required"));
    }

    if (typeof googleIdToken !== "string") {
      return next(createError(400, "Google ID Token must be a string"));
    }

    const userData = await getAccssToken({
      google_token: googleIdToken,
    });

    if (!userData) {
      return next(createError(401, "Invalid Google ID Token"));
    }

    const user = await prisma.user.findUnique({
      where: {
        email: userData.data.employee.email,
      },
    });

    if (!user) {
      return next(createError(401, "User not found"));
    }

    if (user.is_active === false) {
      return next(createError(401, "User is not active"));
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        external_token: userData.data.token,
        external_id: String(userData.data.employee.id),
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "secret_token_incase_of_not_found_of_token"
    );

    createSuccess(res, "Login Successfully", {
      token,
      role: user.roles,
    });
  } catch (error: any) {
    next(createError(403, String(error) ));
  }
};

/**
 * @access Private
 * @description Register user with email
 * @route POST /auth/register
 * @returns {object} - Message with user id
 */

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      name,
      roles,
      external_id,
      external_token,
      user_type,
      manager_id,
      is_active,
    } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return next(createError(400, "User already exists with this email"));
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        roles,
        external_id,
        external_token,
        user_type,
        manager_id,
        is_active,
      },
    });

    if (!newUser) {
      return next(createError(400, "Failed to create user"));
    }

    createSuccess(res, "User created successfully", {
      id: newUser.id,
    });
  } catch (error: any) {
    next(createError(403, error || "Something went wrong in register"));
  }
};
