"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.getDepartmentById = exports.getAllDepartments = exports.createDepartment = void 0;
const dbconfig_1 = require("../../config/db/dbconfig");
const messageResponse_1 = require("../../utils/messageResponse");
// Create Department
const createDepartment = async (req, res, next) => {
    try {
        const { name, slug, description } = req.body;
        const existingDepartment = await dbconfig_1.prisma.department.findUnique({
            where: { slug: slug },
        });
        if (existingDepartment) {
            return next((0, messageResponse_1.createError)(400, "Department with this slug already exists"));
        }
        const department = await dbconfig_1.prisma.department.create({
            data: {
                name,
                slug: slug,
                description,
            },
        });
        (0, messageResponse_1.createSuccess)(res, "Department created successfully", department);
    }
    catch (error) {
        next((0, messageResponse_1.createError)(500, "Failed to create department"));
    }
};
exports.createDepartment = createDepartment;
// Get All Departments
const getAllDepartments = async (req, res, next) => {
    try {
        const departments = await dbconfig_1.prisma.department.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        (0, messageResponse_1.createSuccess)(res, "Departments fetched successfully", departments);
    }
    catch (error) {
        next((0, messageResponse_1.createError)(500, "Failed to fetch departments"));
    }
};
exports.getAllDepartments = getAllDepartments;
// Get Department by ID
const getDepartmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const department = await dbconfig_1.prisma.department.findUnique({
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
            return next((0, messageResponse_1.createError)(404, "Department not found"));
        }
        (0, messageResponse_1.createSuccess)(res, "Department fetched successfully", department);
    }
    catch (error) {
        next((0, messageResponse_1.createError)(500, "Failed to fetch department"));
    }
};
exports.getDepartmentById = getDepartmentById;
// Update Department
const updateDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const existingDepartment = await dbconfig_1.prisma.department.findUnique({
            where: { id: Number(id) },
        });
        if (!existingDepartment) {
            return next((0, messageResponse_1.createError)(404, "Department not found"));
        }
        const department = await dbconfig_1.prisma.department.update({
            where: { id: Number(id) },
            data: {
                ...(name && { name }),
                ...(description && { description }),
            },
        });
        (0, messageResponse_1.createSuccess)(res, "Department updated successfully", department);
    }
    catch (error) {
        next((0, messageResponse_1.createError)(500, "Failed to update department"));
    }
};
exports.updateDepartment = updateDepartment;
// Delete Department
const deleteDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existingDepartment = await dbconfig_1.prisma.department.findUnique({
            where: { id: Number(id) },
        });
        if (!existingDepartment) {
            return next((0, messageResponse_1.createError)(404, "Department not found"));
        }
        await dbconfig_1.prisma.department.delete({
            where: { id: Number(id) },
        });
        (0, messageResponse_1.createSuccess)(res, "Department deleted successfully");
    }
    catch (error) {
        next((0, messageResponse_1.createError)(500, "Failed to delete department"));
    }
};
exports.deleteDepartment = deleteDepartment;
