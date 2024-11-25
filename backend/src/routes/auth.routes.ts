import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
