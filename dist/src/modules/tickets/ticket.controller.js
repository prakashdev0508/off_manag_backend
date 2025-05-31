"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicket = exports.getAllTickets = exports.createTicket = void 0;
const ticket_schema_1 = require("../../schema/ticket.schema");
const dbconfig_1 = require("../../config/db/dbconfig");
const messageResponse_1 = require("../../utils/messageResponse");
const client_1 = require("@prisma/client");
const createTicket = async (req, res, next) => {
    try {
        const { description, priority, category, property_id, department_id, attachments, city_name, cluster_id, external_links, } = ticket_schema_1.createTicketSchema.parse(req.body);
        const user = res.locals.user;
        const ticket = await dbconfig_1.prisma.ticket.create({
            data: {
                description,
                priority,
                category,
                property_id,
                department_id,
                attachments,
                city_name: city_name?.trim()?.toLowerCase() || null,
                cluster_id,
                external_links,
                created_by: user.id,
            },
        });
        (0, messageResponse_1.createSuccess)(res, "Ticket created successfully", { id: ticket.id });
    }
    catch (error) {
        next((0, messageResponse_1.createError)(500, error || "Failed to create ticket"));
    }
};
exports.createTicket = createTicket;
const getAllTickets = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc", priority, category, department_id, status, property_id, city_name, cluster_id, } = req.query;
        const { by_me } = req.body;
        const user = res.locals.user;
        // Build where conditions for filtering
        const whereConditions = {};
        whereConditions.AND = [
            search
                ? {
                    description: { contains: String(search), mode: "insensitive" },
                }
                : {},
            priority ? { priority: priority } : {},
            category ? { category: category } : {},
            department_id ? { department_id: Number(department_id) } : {},
            status ? { status: status } : {},
            property_id ? { property_id: Number(property_id) } : {},
            city_name
                ? { city_name: city_name.trim().toLowerCase() }
                : {},
            cluster_id ? { cluster_id: Number(cluster_id) } : {},
        ];
        // Check if user is not super_admin or admin
        if (!user.roles.includes(client_1.Role.super_admin) &&
            !user.roles.includes(client_1.Role.admin)) {
            // First check assigned properties
            if (user.assigned_properties && user.assigned_properties.length > 0) {
                whereConditions.AND.push({
                    property_id: { in: user.assigned_properties },
                });
            }
            else {
                // If no assigned properties, check departments
                const userDepartments = await dbconfig_1.prisma.userDepartment.findMany({
                    where: { userId: user.id },
                    select: { departmentId: true },
                });
                const departmentIds = userDepartments.map((dept) => dept.departmentId);
                whereConditions.AND.push({
                    department_id: { in: departmentIds },
                });
            }
        }
        if (by_me) {
            whereConditions.created_by = user.id;
        }
        // Build order by condition
        const orderBy = {
            [String(sortBy)]: sortOrder,
        };
        // Get total count for pagination
        const totalCount = await dbconfig_1.prisma.ticket.count({
            where: whereConditions,
        });
        // Get paginated and filtered results
        const tickets = await dbconfig_1.prisma.ticket.findMany({
            where: whereConditions,
            orderBy,
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            include: {
                department: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        (0, messageResponse_1.createSuccess)(res, "Tickets Data", {
            tickets,
            pagination: {
                total: totalCount,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(totalCount / Number(limit)),
            },
        });
    }
    catch (error) {
        next((0, messageResponse_1.createError)(500, error.message || "Failed to retrieve tickets"));
    }
};
exports.getAllTickets = getAllTickets;
const updateTicket = async (req, res, next) => {
    try {
    }
    catch (error) {
        next((0, messageResponse_1.createError)(500, error || "Failed to update ticket"));
    }
};
exports.updateTicket = updateTicket;
