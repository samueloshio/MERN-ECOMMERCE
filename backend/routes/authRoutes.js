import { register } from "../controller/authController";

const express = require("express");

const router = express.Router();

// Register route
router.post("/join", register)

// Login route
// router.post("/login", login)

export default router;
