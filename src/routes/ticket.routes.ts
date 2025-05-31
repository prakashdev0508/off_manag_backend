import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  updateTicket,
  getTicketById,
} from "../modules/tickets/ticket.controller";
import { verifyToken } from "../middleware/authentication";

const router = Router();

router.post("/create", verifyToken, createTicket);
router.get("/", verifyToken, getAllTickets);
router.put("/:id", verifyToken, updateTicket);
router.get("/:id", verifyToken, getTicketById);

export default router;
