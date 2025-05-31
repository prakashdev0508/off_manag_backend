import { NextFunction, Request, Response } from "express";
import { createTicketSchema } from "../../schema/ticket.schema";
import { prisma } from "../../config/db/dbconfig";
import { createError, createSuccess } from "../../utils/messageResponse";

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
        created_by: user.id,
      },
    });

    createSuccess(res, "Ticket created successfully", ticket.id);
  } catch (error) {
    next(createError(500, "Failed to create ticket", error));
  }
};
