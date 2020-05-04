import Joi from '@hapi/joi';

export const validateLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
}

export const validateCommand = (data) => {
  const year = new Date();
  const curr_year = year.getFullYear();

  const schema = Joi.object({
    book: Joi.string().required(),
    category: Joi.string().required().min(3),
    command: Joi.array().required().min(1),
    church: Joi.string().required().min(3),
    year: Joi.number().required().min(curr_year).max(curr_year+1),
    term: Joi.number().required().min(1).max(4)
  });
  return schema.validate(data);
}