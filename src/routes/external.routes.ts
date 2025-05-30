import { Router } from "express";
import { propertyList } from "../services/external/mainbackend/lists";
import { verifyToken } from "../middleware/authentication";

const router = Router();

router.get("/property-list" , verifyToken , propertyList);

export default router;
