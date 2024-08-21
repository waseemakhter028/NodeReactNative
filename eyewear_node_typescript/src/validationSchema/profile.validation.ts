import Joi from 'joi';
import { PASSWORD } from '../constant/common';

const { MIN, MAX } = PASSWORD;

const schema = {
  changePassword: Joi.object({
    current_password: Joi.string()
      .trim()
      .required()
      .min(MIN)
      .max(MAX)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        'string.pattern.base':
          'Must contain minimum 8 characters, at least one upper case letter, one number and one special character',
      }),
    new_password: Joi.string()
      .trim()
      .required()
      .min(MIN)
      .max(MAX)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        'string.pattern.base':
          'Must contain minimum 8 characters, at least one upper case letter, one number and one special character',
      }),
    confirm_password: Joi.string()
      .trim()
      .equal(Joi.ref('new_password'))
      .required()
      .min(MIN)
      .max(MAX)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        'string.pattern.base':
          'Must contain minimum 8 characters, at least one upper case letter, one number and one special character',
        'any.only': 'Confirm password must match the new password',
      }),
  }),
};

export default schema;
