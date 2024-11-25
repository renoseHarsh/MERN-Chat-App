import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import {
  getUserDetails,
  getUsersBySearch,
} from "../controllers/user.controller";

const router = Router();

router.get("/me", authenticateJWT, getUserDetails);
router.get("/search", authenticateJWT, getUsersBySearch);

export default router;
