import { Router } from "express";
import authRoutes from "./auth.routes";
import externalRoutes from "./external.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/external", externalRoutes);

export default router;
