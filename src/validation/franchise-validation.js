import Joi from "joi";

const createFranchiseValidation = Joi.object({
  franchise_name: Joi.required(),
  address: Joi.optional(),
  description: Joi.optional(),
  category: Joi.required(),
  whatsapp_number: Joi.optional(),
  franchiseType: Joi.array().required(),
});

const getFranchiseValidation = Joi.number().positive().required();

const updateFranchiseValidation = Joi.object({
  id: Joi.number().positive().required(),
  franchise_name: Joi.required(),
  address: Joi.optional(),
  description: Joi.optional(),
  category: Joi.required(),
  whatsapp_number: Joi.optional(),
  franchiseType: Joi.array().required(),
});

const searchFranchiseValidation = Joi.object({
  franchise_name: Joi.optional(),
  address: Joi.optional(),
  description: Joi.optional(),
  category: Joi.optional(),
  whatsapp_number: Joi.optional(),
});

export {
  createFranchiseValidation,
  getFranchiseValidation,
  updateFranchiseValidation,
  searchFranchiseValidation,
};
