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
    id_code: Joi.string().required(),
    category: Joi.string().required(),
    name: Joi.string().required(),
    command: Joi.object().required().min(1),
    church: Joi.number().required().min(1),
    year: Joi.number().required().min(curr_year).max(curr_year+1),
    term: Joi.number().required().min(1).max(4)
  });
  return schema.validate(data);
}

export const validateChurch = (data) => {

  const schema = Joi.object({
    field: Joi.string().required().min(2),
    zone: Joi.string().required().min(2),
    district: Joi.string().required().min(2),
    church: Joi.string().required().min(2),
    pastor: Joi.number().required().min(4)
  });
  return schema.validate(data);
}

export const validatTimetable = (data) => {
  const year = new Date();
  const curr_year = year.getFullYear();

  const schema = Joi.object({
    year: Joi.number().required().min(curr_year).max(curr_year+1),
    term: Joi.number().required().min(1).max(4),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  });
  return schema.validate(data);
}

export const validateOtherBooksRequest = (data) => {

  const schema = Joi.object({
    bookid: Joi.number().required().min(1),
    church_id: Joi.number().required().min(1),
    request: Joi.number().required().min(1),
  });
  return schema.validate(data);
}