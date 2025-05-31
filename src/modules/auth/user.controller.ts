import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db/dbconfig";
import { updateUserSchema } from "../../schema/user.schema";
import { createError, createSuccess } from "../../utils/messageResponse";

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      name,
      departments,
      roles,
      user_type,
      isActive,
      assigned_properties,
    } = updateUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.is_active === false) {
      return next(createError(403, "User is not active"));
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        ...(name && { name }),
        ...(roles && { roles }),
        ...(user_type && { user_type }),
        ...(isActive !== undefined && { is_active: isActive }),
        ...(departments && {
          departments: {
            deleteMany: {},
            create: departments.map((departmentId) => ({
              departmentId: Number(departmentId),
            })),
          },
        }),
        ...(assigned_properties && {
          assigned_properties: assigned_properties.map(Number),
        }),
      },
      include: {
        departments: {
          include: {
            department: true,
          },
        },
      },
    });

    createSuccess(res, "User updated successfully", updatedUser);
  } catch (error: any) {
    return next(createError(500, error));
  }
};

