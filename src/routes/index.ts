import { Router } from "express";
import authRoutes from "./auth.routes";
import externalRoutes from "./external.routes";
import userRoutes from "./user.routes";
import departmentRoutes from "./department.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/external", externalRoutes);
router.use("/user", userRoutes);
router.use("/department", departmentRoutes);

export default router;

