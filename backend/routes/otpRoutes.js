import express from "express";
import { sendOTP, verifyOTP } from "../controller/otp.js";

const router = express.Router();

// OTP route
router.post("/otp", sendOTP);

// Verify OTP
router.post("/verify", verifyOTP);

export default router;
