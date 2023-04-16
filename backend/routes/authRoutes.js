import express from "express";
import { login, register } from "../controller/authController.js";

const router = express.Router();

// Register route
router.post("/join", register);

// Login route
router.post("/login", login)

export default router;
