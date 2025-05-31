import { NextFunction, Request, Response } from "express";
import { createTicketSchema } from "../../schema/ticket.schema";
import { prisma } from "../../config/db/dbconfig";
import { createError, createSuccess } from "../../utils/messageResponse";
import {
  Prisma,
  TicketPriority,
  TicketCategory,
  TicketStatus,
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
    next(createError(500, error.message || "Failed to create ticket"));
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

    // Build where conditions for filtering
    const whereConditions: Prisma.TicketWhereInput = {
      AND: [
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
      ],
    };

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
