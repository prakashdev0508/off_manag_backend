import { Router } from "express";
import { login, register } from "../modules/auth/controller";
import { verifyToken, verifyRole } from "../middleware/authentication";

const router = Router();

router.post("/login", login);
router.post("/register", verifyToken, verifyRole(["admin"]), register);

export default router;
