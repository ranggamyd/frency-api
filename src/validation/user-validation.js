import Joi from "joi";

const registerUserValidation = Joi.object({
  name: Joi.required(),
  email: Joi.required(),
  phone: Joi.optional(),
  username: Joi.optional(),
  gender: Joi.optional(),
  avatar: Joi.optional(),
  password: Joi.required(),
  role: Joi.required(),
});

const loginUserValidation = Joi.object({
  email: Joi.required(),
  password: Joi.required(),
});

const updateUserValidation = Joi.object({
  name: Joi.optional(),
  email: Joi.optional(),
  phone: Joi.optional(),
  username: Joi.optional(),
  gender: Joi.optional(),
  avatar: Joi.optional(),
  password: Joi.optional(),
  role: Joi.optional(),
});

export { registerUserValidation, loginUserValidation, updateUserValidation };
