"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const external_routes_1 = __importDefault(require("./external.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const department_routes_1 = __importDefault(require("./department.routes"));
const ticket_routes_1 = __importDefault(require("./ticket.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/external", external_routes_1.default);
router.use("/user", user_routes_1.default);
router.use("/department", department_routes_1.default);
router.use("/ticket", ticket_routes_1.default);
exports.default = router;
