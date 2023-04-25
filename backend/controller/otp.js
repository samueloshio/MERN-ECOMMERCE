import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import OTP from "../model/otp.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import generateOTP from "../utils/generateOtp.js";
import { hashData } from "../utils/hashData.js";
import sendMail from "../utils/sendMail.js";

/** POST: http://localhost:8000/api/v1/otp */
const sendOTP = catchAsyncErrors(async (req, res, next) => {
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

export default sendOTP;
