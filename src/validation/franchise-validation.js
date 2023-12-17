import Joi from "joi";

const uploadFranchiseValidation = Joi.object({
  image: Joi.binary().encoding("base64").required(),
});

const createFranchiseValidation = Joi.object({
  franchise_name: Joi.required(),
  address: Joi.required(),
  description: Joi.required(),
  category: Joi.required(),
  whatsapp_number: Joi.required(),
  franchiseType: Joi.array().required(),
});

const getFranchiseValidation = Joi.number().positive().required();

const updateFranchiseValidation = Joi.object({
  id: Joi.number().positive().required(),
  franchise_name: Joi.required(),
  address: Joi.required(),
  description: Joi.required(),
  category: Joi.required(),
  whatsapp_number: Joi.required(),
  franchiseType: Joi.array().required(),
});

const searchFranchiseValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  // franchise_name: Joi.required(),
  // address: Joi.required(),
  // description: Joi.required(),
  // category: Joi.required(),
  // whatsapp_number: Joi.required(),
});

export {
  uploadFranchiseValidation,
  createFranchiseValidation,
  getFranchiseValidation,
  updateFranchiseValidation,
  searchFranchiseValidation,
};
