import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db/dbconfig";
import { createError, createSuccess } from "../../utils/messageResponse";
import { DepartmentSlug } from "@prisma/client";

// Create Department
export const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, slug, description } = req.body;

    const existingDepartment = await prisma.department.findUnique({
      where: { slug: slug as DepartmentSlug },
    });

    if (existingDepartment) {
      return next(createError(400, "Department with this slug already exists"));
    }

    const department = await prisma.department.create({
      data: {
        name,
        slug: slug as DepartmentSlug,
        description,
      },
    });

    createSuccess(res, "Department created successfully", department);
  } catch (error) {
    next(createError(500, "Failed to create department"));
  }
};

// Get All Departments
export const getAllDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    createSuccess(res, "Departments fetched successfully", departments);
  } catch (error) {
    next(createError(500, "Failed to fetch departments"));
  }
};

// Get Department by ID
export const getDepartmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!department) {
      return next(createError(404, "Department not found"));
    }

    createSuccess(res, "Department fetched successfully", department);
  } catch (error) {
    next(createError(500, "Failed to fetch department"));
  }
};

// Update Department
export const updateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingDepartment = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!existingDepartment) {
      return next(createError(404, "Department not found"));
    }

    const department = await prisma.department.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
      },
    });

    createSuccess(res, "Department updated successfully", department);
  } catch (error) {
    next(createError(500, "Failed to update department"));
  }
};

// Delete Department
export const deleteDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existingDepartment = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!existingDepartment) {
      return next(createError(404, "Department not found"));
    }

    await prisma.department.delete({
      where: { id: Number(id) },
    });

    createSuccess(res, "Department deleted successfully");
  } catch (error) {
    next(createError(500, "Failed to delete department"));
  }
};
