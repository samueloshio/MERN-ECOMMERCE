import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import OTP from "../model/otp.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const sendOTP = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, subject, message, duration = 1 } = req.body;
    if (!email || !subject || !message) {
      return next(
        new ErrorHandler("Please provide for email, subject and message", 401)
      );
    }

    //   clear any old record
    await OTP.deleteOne({ email });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
});
