import Joi from 'joi';

const schema = {
  getAddress: Joi.object({
    user_id: Joi.string().trim().required().max(500),
  }),
  addAddress: Joi.object({
    id: Joi.string().allow(null).max(40),
    user_id: Joi.string().trim().required().max(500),
    street: Joi.string().trim().required().max(20),
    address_type: Joi.string().trim().required().max(20),
    address: Joi.string().trim().required().max(40),
    landmark: Joi.string().trim().required().max(40),
    state: Joi.string().trim().required().max(20),
    city: Joi.string().trim().required().max(20),
    zipcode: Joi.number().required().max(999999),
  }),
  showAddress: Joi.object({
    id: Joi.string().trim().required().max(500),
  }),
  updateAddress: Joi.object({
    id: Joi.any().required(),
    user_id: Joi.string().trim().required().max(500),
    street: Joi.string().trim().required().max(20),
    address_type: Joi.string().trim().required().max(20),
    address: Joi.string().trim().required().max(40),
    landmark: Joi.string().trim().required().max(40),
    state: Joi.string().trim().required().max(20),
    city: Joi.string().trim().required().max(20),
    zipcode: Joi.number().required().max(999999),
  }),
  deleteAddress: Joi.object({
    id: Joi.string().trim().required().max(500),
  }),
};

export default schema;
