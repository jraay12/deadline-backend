const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format",
    }),
  password: Joi.string().min(6).required(),
  firstname: Joi.string().required(),
  middlename: Joi.string().optional().allow(null, ""),
  lastname: Joi.string().required(),
});

module.exports = {
  userSchema,
};
