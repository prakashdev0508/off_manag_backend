import { Router } from "express";
import { createTicket, getAllTickets } from "../modules/tickets/ticket.controller";
import { verifyToken } from "../middleware/authentication";

const router = Router();

router.post("/create", verifyToken, createTicket);
router.get("/", verifyToken, getAllTickets);

export default router;
