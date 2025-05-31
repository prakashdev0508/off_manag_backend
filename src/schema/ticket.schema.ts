import { z } from "zod";
import { TicketCategory, TicketPriority } from "@prisma/client";


export const createTicketSchema = z.object({
    description: z.string().min(1),
    priority: z.nativeEnum(TicketPriority).optional(),
    category: z.nativeEnum(TicketCategory),
    property_id: z.number().optional(),
    department_id: z.number().optional(),
    attachments: z.array(z.string()).optional(),
    city_name : z.string().optional(),
    cluster_id : z.number().optional(),
    external_links : z.array(z.string().url()).optional(),
});