import { body } from "express-validator";
export const joinValidations = [
  // name must be an name
  body("name")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Name is required!"),
  // email must be an email
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("Email is required!"),
  // password must be at least 5 chars long
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long!"),
];
export const loginValidations = [
  // email must be an email
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("Email is required!"),
  // password must be at least 5 chars long
  body("password").not().isEmpty().withMessage("Password is required!"),
];
