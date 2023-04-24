import express from "express";
import { login, signup } from "../controller/authController.js";
import { joinValidations, loginValidations } from "../utils/reqValidations.js";

const router = express.Router();

// Register route
router.post("/signup", joinValidations, signup);

// Login route
router.post("/login", loginValidations, login);

export default router;
