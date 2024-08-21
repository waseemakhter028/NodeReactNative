import Joi from 'joi';

const schema = {
  deliveryCharge: Joi.object({
    total_amount: Joi.number().required().max(200000),
  }),
  checkoutInfo: Joi.object({
    user_id: Joi.string().required().max(500),
  }),
  checkOrder: Joi.object({
    user_id: Joi.string().required().max(500),
  }),
  applyCoupon: Joi.object({
    user_id: Joi.string().required().max(500),
    coupon_code: Joi.string().required().max(20),
  }),
  placeOrder: Joi.object({
    user_id: Joi.string().trim().required().max(500),
    payment_method: Joi.string().trim().required().max(8),
    paymentId: Joi.any().when('payment_method', {
      is: 'coupon',
      then: Joi.optional(),
      otherwise: Joi.string().trim().required().min(18).max(30),
    }),
    address_id: Joi.string().trim().required().max(500),
    notes: Joi.string().trim().max(500),
    coupon_code: Joi.any().when('payment_method', {
      is: 'coupon',
      then: Joi.string().required().max(12),
      otherwise: Joi.optional(),
    }),
  }),

  orders: Joi.object({
    user_id: Joi.string().trim().required().max(500),
    status: Joi.number().required().min(1).max(4),
    page: Joi.number().required().min(1).max(999999999999999),
  }),
};

export default schema;
