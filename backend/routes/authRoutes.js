import express from "express";
import { login, signup } from "../controller/authController.js";

const router = express.Router();

// Register route
router.post("/signup", signup);

// Login route
router.post("/login", login)

export default router;
