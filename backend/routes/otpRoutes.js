import express from "express";
import { sendOTP, verifyOTP } from "../controller/otp.js";
import { sendEmailVerificationOTP } from "../controller/authController.js";

const router = express.Router();

// OTP route
router.post("/new", sendOTP);

// Verify OTP
router.post("/verify", verifyOTP);

router.post("/email-verify", sendEmailVerificationOTP);
export default router;
