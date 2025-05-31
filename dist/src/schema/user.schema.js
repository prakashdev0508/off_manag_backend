"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().optional(),
    departments: zod_1.z.array(zod_1.z.number()).optional(),
    roles: zod_1.z.array(zod_1.z.nativeEnum(client_1.Role)).optional(),
    user_type: zod_1.z.nativeEnum(client_1.UserType).optional(),
    isActive: zod_1.z.boolean().optional(),
    assigned_properties: zod_1.z.array(zod_1.z.number()).optional(),
});
