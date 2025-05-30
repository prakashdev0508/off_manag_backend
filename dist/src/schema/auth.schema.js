"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    roles: zod_1.z.array(zod_1.z.nativeEnum(client_1.Role)),
    external_id: zod_1.z.string(),
    external_token: zod_1.z.string().optional(),
    user_type: zod_1.z.nativeEnum(client_1.UserType),
    manager_id: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().optional(),
});
