import { Router } from "express";
import authRoutes from "./auth.routes";
import externalRoutes from "./external.routes";
import userRoutes from "./user.routes";
import departmentRoutes from "./department.routes";
import ticketRoutes from "./ticket.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/external", externalRoutes);
router.use("/user", userRoutes);
router.use("/department", departmentRoutes);
router.use("/ticket", ticketRoutes);

export default router;

