import Joi from "joi";

const createFranchiseValidation = Joi.object({
  franchise_name: Joi.required(),
  address: Joi.optional(),
  description: Joi.optional(),
  category: Joi.required(),
  whatsapp_number: Joi.optional(),
  franchiseType: Joi.array()
    .items(
      Joi.object({
        franchise_type: Joi.required(),
        facility: Joi.required(),
        price: Joi.required(),
      })
    )
    .required(),
});

const updateFranchiseValidation = Joi.object({
  franchise_name: Joi.required(),
  address: Joi.optional(),
  description: Joi.optional(),
  category: Joi.required(),
  whatsapp_number: Joi.optional(),
  franchiseType: Joi.array()
    .items(
      Joi.object({
        franchise_type: Joi.required(),
        facility: Joi.required(),
        price: Joi.required(),
      })
    )
    .required(),
});

const searchFranchiseValidation = Joi.object({
  franchise_name: Joi.optional(),
  address: Joi.optional(),
  description: Joi.optional(),
  category: Joi.optional(),
  whatsapp_number: Joi.optional(),
  franchise_type: Joi.optional(),
  facility: Joi.optional(),
  price: Joi.optional(),
});

export { createFranchiseValidation, updateFranchiseValidation, searchFranchiseValidation };
