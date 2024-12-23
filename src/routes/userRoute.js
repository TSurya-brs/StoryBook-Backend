import express from "express";
import {
  createUser,
  verifyEmail,
  loginUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/verifyEmail/:verify_token", verifyEmail);
router.post("/login", loginUser);

export default router;
