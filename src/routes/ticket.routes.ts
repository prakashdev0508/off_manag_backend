import { Router } from "express";
import { createTicket } from "../modules/tickets/ticket.controller";

const router = Router();

router.post("/create", createTicket);

export default router;

