import Joi from "joi";

const registerUserValidation = Joi.object({
  name: Joi.required(),
  email: Joi.required(),
  password: Joi.required(),
  role: Joi.required(),
});

const loginUserValidation = Joi.object({
  email: Joi.required(),
  password: Joi.required(),
});

const getUserValidation = Joi.required();

const updateUserValidation = Joi.object({
  id: Joi.required(),
  name: Joi.required(),
  email: Joi.required(),
  password: Joi.required(),
  role: Joi.required(),
});

export {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
};
