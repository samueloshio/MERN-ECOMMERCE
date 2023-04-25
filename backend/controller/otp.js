import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import OTP from "../model/otp.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import generateOTP from "../utils/generateOtp.js";
import { hashData, verifyHashData } from "../utils/hashData.js";
import sendMail from "../utils/sendMail.js";

/** POST: http://localhost:8000/api/v1/otp */
export const sendOTP = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, subject, message, duration = 1 } = req.body;
    if (!(email && subject && message)) {
      return next(
        new ErrorHandler("Please provide for email, subject and message", 401)
      );
    }
    // if (duration != 1) {
    //   return next(new ErrorHandler("Duration is not enough"));
    // }

    //   clear any old record
    await OTP.deleteOne({ email });

    // Generate OTP
    const generatedOTP = await generateOTP();

    // Send Email to User
    http: try {
      await sendMail({
        email: email,
        subject: subject,
        message: `<p>${message}</p> <p style="color:tomato; font-size:25px; letter-spacing:2px"><b>${generatedOTP}</b></p> <p>This code <b>expires in ${duration} hour(s)</b>. </p>`,
      });

      // save OTP record in database
      const hashedData = await hashData(generatedOTP);
      await OTP.create({
        email,
        otp: hashedData,
        expiresAt: Date.now() + 3600000 * +duration,
      });

      res.status(200).json({
        success: true,
        message: `An OTP has been sent to ${email}`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    if (!(email && otp)) {
      return res.status(401).send("Invalid Email or OTP");
    }

    // check if otp exist
    const matchOTPRecord = await OTP.findOne({ email });
    if (!matchOTPRecord) {
      return res.status(401).send("Code not valid!");
    }

    // check if OTP not expired
    // const { expiresAt } = matchOTPRecord;
    if (matchOTPRecord.expiresAt < Date.now()) {
      return res
        .status(403)
        .send("Code has expired. Kindly request for a new one");
    }

    // verify code
    const hashedOTP = matchOTPRecord.otp;
    const validOTP = await verifyHashData(otp, hashedOTP);
    if (validOTP === false) {
      return res
        .status(403)
        .send("Code has expired or not valid. Kindly request for a new one");
    } else {
      return res.status(201).send(`${email} Successfully Verified!`);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const deleteOTP = async (email) => {
  try {
    await OTP.deleteOne({ email });
  } catch (error) {
    throw error;
  }
};
