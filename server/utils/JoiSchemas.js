const Joi = require("joi");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authSchema = Joi.object({
  username: Joi.string().alphanum().min(5).max(20).required().messages({
    "string.base": "Username should be a type of text!",
    "string.empty": "Username can't be empty!",
    "string.min":
      "Username should have a minimum length of {#limit} characters!",
    "string.max":
      "Username should have a maximum length of {#limit} characters!",
    "any.required": "Username is required!",
  }),
  email: Joi.string()
    .email()
    .pattern(emailRegex)
    .min(8)
    .max(30)
    .required()
    .messages({
      "string.base": "Email should be a type of text!",
      "string.empty": "Email can't be empty!",
      "string.min": "Email should be atleast {#limit} characters long!",
      "string.max": "Email can't be longer than {#limit} characters!",
      "string.email": "Please enter a valid email address!",
      "string.pattern.base": "Email contains illegal characters!",
      "any.required": "Email is required!",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password should be atleast {#limit} characters long!",
    "string.empty": "Password cannot be an empty field!",
    "any.required": "Password is required!",
  }),
  c_password: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match the password!",
    "string.empty": "Confirm password cannot be an empty field!",
    "any.required": "Confirm password is required!",
  }),
});

module.exports = {
  authSchema,
};
