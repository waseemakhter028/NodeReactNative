import Joi from 'joi';

const schema = {
  getCart: Joi.object({
    user_id: Joi.string().trim().required().max(500),
  }),
  addCart: Joi.object({
    user_id: Joi.string().trim().required().max(500),
    product_id: Joi.string().trim().required().max(500),
    quantity: Joi.number().required().max(20),
    size: Joi.string().trim().max(2),
    color: Joi.string().trim().max(20),
  }),
  updateCart: Joi.object({
    id: Joi.string().trim().required().max(500),
    quantity: Joi.number().required().max(20),
  }),
  deleteCart: Joi.object({
    id: Joi.string().trim().required().max(500),
  }),
};

export default schema;
