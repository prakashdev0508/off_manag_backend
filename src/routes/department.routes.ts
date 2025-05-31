import { Router } from "express";
import { verifyToken, verifyRole } from "../middleware/authentication";
import { Role } from "@prisma/client";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../modules/common/department.controller";

const router = Router();

// Protected routes - require authentication
router.use(verifyToken);

// Get all departments - accessible by all authenticated users
router.get("/", getAllDepartments);

// Get department by ID - accessible by all authenticated users
router.get("/:id", getDepartmentById);

// Admin only routes
router.post("/", verifyRole([Role.admin, Role.super_admin]), createDepartment);
router.put("/:id", verifyRole([Role.admin, Role.super_admin]), updateDepartment);
router.delete("/:id", verifyRole([Role.admin, Role.super_admin]), deleteDepartment);

export default router; 