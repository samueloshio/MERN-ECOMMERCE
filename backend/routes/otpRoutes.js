import express from "express";
import sendOTP from "../controller/otp.js";

const router = express.Router();

// OTP route
router.post("/otp", sendOTP);





export default router;