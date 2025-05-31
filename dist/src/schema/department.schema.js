"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDepartmentSchema = exports.createDepartmentSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Department name must be at least 2 characters"),
    slug: zod_1.z.nativeEnum(client_1.DepartmentSlug),
    description: zod_1.z.string().optional(),
});
exports.updateDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Department name must be at least 2 characters").optional(),
    description: zod_1.z.string().optional(),
});
