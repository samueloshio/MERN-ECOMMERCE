import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// const otpGenerator = require("otp-generator");
// const jwt = require("jsonwebtoken");
// const sendMail = require("../utils/sendMail");
// const sendToken = require("../utils/jwtToken");

// REGISTER CONTROLLER
/** POST: http://localhost:8080/api/auth/join */
export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      // phoneNumber: req.body.phoneNumber,
      // city: req.body.city,
      // address: req.body.address
    });

    //Check if user already exist
    const user = await User.findOne({ email: req.body.email });
    if (user) return next(createError(400, "User already exist"));

    // new user store into database
    await newUser.save();
    res.status(200).send("Registration successful!!!");
  } catch (err) {
    next(err);
  }
};

// LOGIN USER

export const login = async (req, res, next) => {
  try {
    // check if user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User does not exist"));

    // check password authentication
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "invalid username or password"));

    const token = jwt.sign(
      { id: user._id, isSuperUser: user.isSuperUser },
      process.env.JWT
    );

    // distructure the user details to hide password and admin info
    const { password, isSuperUser, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ ...otherDetails });
  } catch (err) {
    next(err);
  }
};
