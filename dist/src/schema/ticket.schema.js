"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketSchema = exports.createTicketSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createTicketSchema = zod_1.z.object({
    description: zod_1.z.string().min(1),
    priority: zod_1.z.nativeEnum(client_1.TicketPriority).optional(),
    category: zod_1.z.nativeEnum(client_1.TicketCategory),
    property_id: zod_1.z.number().optional(),
    department_id: zod_1.z.number().optional(),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
    city_name: zod_1.z.string().optional(),
    cluster_id: zod_1.z.number().optional(),
    external_links: zod_1.z.array(zod_1.z.string().url()).optional(),
});
exports.updateTicketSchema = zod_1.z.object({
    description: zod_1.z.string().min(1).optional(),
    priority: zod_1.z.nativeEnum(client_1.TicketPriority).optional(),
    category: zod_1.z.nativeEnum(client_1.TicketCategory).optional(),
    status: zod_1.z.nativeEnum(client_1.TicketStatus).optional(),
    property_id: zod_1.z.number().optional(),
    department_id: zod_1.z.number().optional(),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
    city_name: zod_1.z.string().optional(),
    cluster_id: zod_1.z.number().optional(),
    external_links: zod_1.z.array(zod_1.z.string().url()).optional(),
});
