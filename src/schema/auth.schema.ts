import { z } from "zod";
import { Role, UserType } from "@prisma/client";

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  roles: z.array(z.nativeEnum(Role)),
  external_id: z.string(),
  external_token: z.string().optional(),
  user_type: z.nativeEnum(UserType),
  manager_id: z.string().optional(),
  is_active: z.boolean().optional(),
});
