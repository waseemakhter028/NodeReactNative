import Joi from 'joi';
import { numbers_validation_regex } from '../constant/common';

const schema = {
  saveContactData: Joi.object({
    name: Joi.string().trim().required().max(40),
    email: Joi.string().trim().email().required().max(60),
    message: Joi.string().trim().required().max(500),
    phone: Joi.string().trim().required().pattern(new RegExp(numbers_validation_regex)).min(10).max(10),
  }),
};

export default schema;
