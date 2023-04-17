import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import hashData from "../utils/hashData.js";
// const otpGenerator = require("otp-generator");
// const jwt = require("jsonwebtoken");
// const sendMail = require("../utils/sendMail");
// const sendToken = require("../utils/jwtToken");

// REGISTER CONTROLLER
/** POST: http://localhost:8000/api/v1/auth/signup */
export const signup = async (req, res, next) => {
  try {
    let { name, email, password, profile } = req.body;
    //Check if user already exist
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      name = name.trim();
      email = email.trim();
      password = password.trim();

      if (!name && email && password) {
        throw Error("Empty input fields");
      } else if (!/^[a-zA-Z ]*$/.test(name)) {
        throw Error("Invalid name Entered!");
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        throw Error("Invalid email Entered!");
      } else if (password.length < 6) {
        throw Error("Passwrd must be 6 character long!");
      } else {
        // Good credentials, create new user
        const hashedPassword = await hashData(password);
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          profile,
          // phoneNumber,
          // city,
          // address
        });

        // new user store into database
        const createUser = await newUser.save();
        res
          .status(200)
          .send({ message: "Registration successful!!!", createUser });
      }
    } else {
      return res
        .status(404)
        .send({ error: `Oops! User with ${email} already exist` });
    }

    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(req.body.password, salt);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
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
