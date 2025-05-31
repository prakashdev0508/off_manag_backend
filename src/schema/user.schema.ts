import { DepartmentSlug, Role, UserType } from "@prisma/client";
import { z } from "zod";

export const updateUserSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    departments: z.array(z.number()).optional(),
    roles: z.array(z.nativeEnum(Role)).optional(),
    user_type: z.nativeEnum(UserType).optional(),
    isActive: z.boolean().optional(),
    assigned_properties: z.array(z.number()).optional(),
})

