import User from "../model/user.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendToken from "../utils/jwtToken.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

// const sendMail = require("../utils/sendMail");

const { JWT_SECRET_KEY, JWT_EXPIRES } = process.env;

// REGISTER CONTROLLER
/** POST: http://localhost:8000/api/v1/auth/signup */
export const signup = async (req, res, next) => {
  let { name, email, password, profile } = req.body;
  try {
    //Check if user already exist
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      // name = name.trim();
      // email = email.trim();
      // password = password.trim();

      // if (!/^[a-zA-Z ]*$/.test(name)) {
      //   return next(new ErrorHandler("Invalid name Entered!", 401));
      //   // throw Error("Invalid name Entered!");
      // } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      //   throw Error("Invalid email Entered!");
      // } else if (password.length < 6) {
      //   throw Error("Passwrd must be 6 character long!");
      // } else {
      //   // Good credentials, create new user
      //   // const hashedPassword = await hashData(password);
      //   // const salt = bcrypt.genSaltSync(10);
      //   // const hashed = bcrypt.hashSync(password, salt);

      // }
      const newUser = new User({
        name,
        email,
        password,
        profile,
        // phoneNumber,
        // city,
        // address
      }); 

      // new user store into database
      const user = await newUser.save();
      sendToken(user, 201, res);
    } else {
      return res
        .status(401)
        .send({ error: `Oops! User with ${email} already exist` });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// LOGIN USER
/** POST: http://localhost:8000/api/v1/auth/login */
export const login = catchAsyncErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      // if (!req.body.email || !req.body.password) {
      //   return next(new ErrorHandler("Invalid Email or Password!", 401));
      // }

      const user = await User.findOne({ email: req.body.email }).select(
        "+password"
      );

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(req.body.password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct password", 401)
        );
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
      });

      // Options for cookies
      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        Secure: true,
      };

      // distructure the user details to hide password info
      const { password, isAdmin, ...userInfo } = user._doc;
      return res
        .status(201)
        .cookie("token", token, options)
        .json({ success: true, userInfo, token });

      // sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } else {
    return next(new ErrorHandler("Invalid email or password", 401));
    // return res.status(401).json({ errors: errors.array() });
  }
});
