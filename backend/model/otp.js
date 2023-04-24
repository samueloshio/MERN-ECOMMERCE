import { Schema, model } from "mongoose";

const OTPSchema = new Schema(
  {
    email: { type: String, unique: true },
    otp: String,
  },
  { timestamps: true }
);

export default model("OTP", OTPSchema)