import { Router } from "express";
import { updateUser } from "../modules/auth/user.controller";
import { verifyToken, verifyRole } from "../middleware/authentication";

const router = Router();

router.put("/update", verifyToken, verifyRole(["admin"]), updateUser);

export default router;
