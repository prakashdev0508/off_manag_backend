import { NextFunction, Request, Response } from "express";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../../schema/ticket.schema";
import { prisma } from "../../config/db/dbconfig";
import { createError, createSuccess } from "../../utils/messageResponse";
import {
  Prisma,
  TicketPriority,
  TicketCategory,
  TicketStatus,
  Role,
} from "@prisma/client";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      description,
      priority,
      category,
      property_id,
      department_id,
      attachments,
      city_name,
      cluster_id,
      external_links,
    } = createTicketSchema.parse(req.body);

    const user = res.locals.user;

    const ticket = await prisma.ticket.create({
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

    createSuccess(res, "Ticket created successfully", { id: ticket.id });
  } catch (error: any) {
    next(createError(500, error || "Failed to create ticket"));
  }
};

export const getAllTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      priority,
      category,
      department_id,
      status,
      property_id,
      city_name,
      cluster_id,
    } = req.query;

    const { by_me } = req.body;
    const user = res.locals.user;

    // Build where conditions for filtering
    const whereConditions: Prisma.TicketWhereInput = {};
    whereConditions.AND = [
      search
        ? {
            description: { contains: String(search), mode: "insensitive" },
          }
        : {},
      priority ? { priority: priority as TicketPriority } : {},
      category ? { category: category as TicketCategory } : {},
      department_id ? { department_id: Number(department_id) } : {},
      status ? { status: status as TicketStatus } : {},
      property_id ? { property_id: Number(property_id) } : {},
      city_name
        ? { city_name: (city_name as string).trim().toLowerCase() }
        : {},
      cluster_id ? { cluster_id: Number(cluster_id) } : {},
    ];

    // Check if user is not super_admin or admin
    if (
      !user.roles.includes(Role.super_admin) &&
      !user.roles.includes(Role.admin)
    ) {
      // First check assigned properties
      if (user.assigned_properties && user.assigned_properties.length > 0) {
        whereConditions.AND.push({
          property_id: { in: user.assigned_properties },
        });
      } else {
        // If no assigned properties, check departments
        const userDepartments = await prisma.userDepartment.findMany({
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
    const orderBy: Prisma.TicketOrderByWithRelationInput = {
      [String(sortBy)]: sortOrder,
    };

    // Get total count for pagination
    const totalCount = await prisma.ticket.count({
      where: whereConditions,
    });

    // Get paginated and filtered results
    const tickets = await prisma.ticket.findMany({
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

    createSuccess(res, "Tickets Data", {
      tickets,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (error: any) {
    next(createError(500, error.message || "Failed to retrieve tickets"));
  }
};

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      description,
      priority,
      category,
      status,
      property_id,
      department_id,
      attachments,
      city_name,
      cluster_id,
      external_links,
    } = updateTicketSchema.parse(req.body);

    const user = res.locals.user;

    // Get existing ticket for comparison
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTicket) {
      return next(createError(404, "Ticket not found"));
    }

    // Create ticket history entries for changed fields
    const historyEntries = [];

    if (description && description !== existingTicket.description) {
      historyEntries.push({
        field: "description",
        old_value: existingTicket.description,
        new_value: description,
      });
    }
    if (priority && priority !== existingTicket.priority) {
      historyEntries.push({
        field: "priority",
        old_value: existingTicket.priority,
        new_value: priority,
      });
    }
    if (category && category !== existingTicket.category) {
      historyEntries.push({
        field: "category",
        old_value: existingTicket.category,
        new_value: category,
      });
    }
    if (status && status !== existingTicket.status) {
      historyEntries.push({
        field: "status",
        old_value: existingTicket.status,
        new_value: status,
      });
    }
    if (property_id && property_id !== existingTicket.property_id) {
      historyEntries.push({
        field: "property_id",
        old_value: String(existingTicket.property_id),
        new_value: String(property_id),
      });
    }
    if (department_id && department_id !== existingTicket.department_id) {
      historyEntries.push({
        field: "department_id",
        old_value: String(existingTicket.department_id),
        new_value: String(department_id),
      });
    }
    if (city_name && city_name !== existingTicket.city_name) {
      historyEntries.push({
        field: "city_name",
        old_value: existingTicket.city_name,
        new_value: city_name,
      });
    }
    if (cluster_id && cluster_id !== existingTicket.cluster_id) {
      historyEntries.push({
        field: "cluster_id",
        old_value: String(existingTicket.cluster_id),
        new_value: String(cluster_id),
      });
    }
    if (
      attachments &&
      JSON.stringify(attachments) !== JSON.stringify(existingTicket.attachments)
    ) {
      historyEntries.push({
        field: "attachments",
        old_value: JSON.stringify(existingTicket.attachments),
        new_value: JSON.stringify(attachments),
      });
    }
    if (
      external_links &&
      JSON.stringify(external_links) !==
        JSON.stringify(existingTicket.external_links)
    ) {
      historyEntries.push({
        field: "external_links",
        old_value: JSON.stringify(existingTicket.external_links),
        new_value: JSON.stringify(external_links),
      });
    }

    const [updatedTicket] = await prisma.$transaction([
      prisma.ticket.update({
        where: { id: Number(id) },
        data: {
          ...(description && { description }),
          ...(priority && { priority }),
          ...(category && { category }),
          ...(status && { status }),
          ...(property_id && { property_id }),
          ...(department_id && { department_id }),
          ...(city_name && { city_name: city_name.trim().toLowerCase() }),
          ...(cluster_id && { cluster_id }),
          ...(attachments && { attachments }),
          ...(external_links && { external_links }),
        },
      }),
      ...historyEntries.map((entry) =>
        prisma.ticketHistory.create({
          data: {
            ticket_id: Number(id),
            user_id: user.id,
            field: entry.field,
            old_value: entry.old_value || null,
            new_value: entry.new_value || null,
          },
        })
      ),
    ]);

    createSuccess(res, "Ticket updated successfully", { id: updatedTicket.id });
  } catch (error: any) {
    next(createError(500, error || "Failed to update ticket"));
  }
};

export const getTicketById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = res.locals.user;

    // Build where conditions for access control
    const whereConditions: Prisma.TicketWhereInput = {
      id: Number(id),
    };

    // Check if user is not super_admin or admin
    if (
      !user.roles.includes(Role.super_admin) &&
      !user.roles.includes(Role.admin)
    ) {
      // First check assigned properties
      if (user.assigned_properties && user.assigned_properties.length > 0) {
        whereConditions.property_id = { in: user.assigned_properties };
      } else {
        // If no assigned properties, check departments
        const userDepartments = await prisma.userDepartment.findMany({
          where: { userId: user.id },
          select: { departmentId: true },
        });

        const departmentIds = userDepartments.map((dept) => dept.departmentId);
        whereConditions.department_id = { in: departmentIds };
      }
    }

    const ticket = await prisma.ticket.findFirst({
      where: whereConditions,
      include: {
        department: {
          select: {
            name: true,
            slug: true,
          },
        },
        created_by_user: {
          select: {
            name: true,
            email: true,
          },
        },
        history: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!ticket) {
      return next(createError(404, "Ticket not found or access denied"));
    }

    createSuccess(res, "Ticket retrieved successfully", ticket);
  } catch (error: any) {
    next(createError(500, error || "Failed to get ticket by id"));
  }
};
