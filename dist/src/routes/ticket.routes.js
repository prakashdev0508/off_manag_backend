"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_controller_1 = require("../modules/tickets/ticket.controller");
const authentication_1 = require("../middleware/authentication");
const router = (0, express_1.Router)();
router.post("/create", authentication_1.verifyToken, ticket_controller_1.createTicket);
router.get("/", authentication_1.verifyToken, ticket_controller_1.getAllTickets);
exports.default = router;
