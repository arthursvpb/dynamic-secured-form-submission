import Joi from 'joi';

export const createFormSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  sections: Joi.array().items(
    Joi.object({
      name: Joi.string().min(1).max(100).required(),
      fields: Joi.array().items(
        Joi.object({
          label: Joi.string().min(1).max(100).required(),
          type: Joi.string().valid('text', 'number').required()
        })
      ).min(1).required()
    })
  ).min(1).required()
});

export const submitFormSchema = Joi.object({
  values: Joi.array().items(
    Joi.object({
      fieldId: Joi.string().uuid().required(),
      value: Joi.string().allow('').required()
    })
  ).min(1).required()
});

export const authSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required()
}); 