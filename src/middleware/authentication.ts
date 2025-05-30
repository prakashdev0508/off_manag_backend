import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/messageResponse";
import { verifyAccessToken } from "../utils/tokens";
import { prisma } from "../config/db/dbconfig";
import { Role } from "@prisma/client";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(createError(401, "No token provided"));
    }

    const decoded = verifyAccessToken(token);

    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      return next(createError(401, "Invalid or expired token"));
    }

    console.log("decoded", decoded);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return next(createError(401, "User not found"));
    }

    res.locals.user = user;
    next();
  } catch (error) {
    return next(createError(401, "Invalid token"));
  }
};

export const verifyRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user || !user.roles) {
      return next(createError(401, "Unauthorized - No user roles found"));
    }

    // Check if user has super_admin role
    if (user.roles.includes("super_admin")) {
      return next();
    }

    // Check if user has any of the allowed roles
    const hasAllowedRole = user.roles.some((userRole: Role) =>
      allowedRoles.includes(userRole)
    );

    if (!hasAllowedRole) {
      return next(createError(403, "Unauthorized"));
    }

    next();
  };
};
