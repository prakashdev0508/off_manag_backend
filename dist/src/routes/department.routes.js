"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middleware/authentication");
const client_1 = require("@prisma/client");
const department_controller_1 = require("../modules/common/department.controller");
const router = (0, express_1.Router)();
// Protected routes - require authentication
router.use(authentication_1.verifyToken);
// Get all departments - accessible by all authenticated users
router.get("/", department_controller_1.getAllDepartments);
// Get department by ID - accessible by all authenticated users
router.get("/:id", department_controller_1.getDepartmentById);
// Admin only routes
router.post("/", (0, authentication_1.verifyRole)([client_1.Role.admin, client_1.Role.super_admin]), department_controller_1.createDepartment);
router.put("/:id", (0, authentication_1.verifyRole)([client_1.Role.admin, client_1.Role.super_admin]), department_controller_1.updateDepartment);
router.delete("/:id", (0, authentication_1.verifyRole)([client_1.Role.admin, client_1.Role.super_admin]), department_controller_1.deleteDepartment);
exports.default = router;
