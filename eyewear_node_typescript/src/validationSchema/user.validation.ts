import Joi from 'joi';
import { PASSWORD } from '../constant/common';

const { MIN, MAX } = PASSWORD;

const schema = {
  registerData: Joi.object({
    name: Joi.string().trim().required().max(40),
    email: Joi.string().trim().email().required().max(60),
    password: Joi.string().trim().required().min(MIN).max(MAX),
    login_type: Joi.number().required().max(1),
  }),

  otpData: Joi.object({
    email: Joi.string().trim().email().required().max(60),
  }),
  verifyotpData: Joi.object({
    email: Joi.string().trim().email().required().max(60),
    otp: Joi.number().integer().required().min(111111).max(999999),
  }),
  loginData: Joi.object({
    email: Joi.string().trim().email().required().max(60),
    password: Joi.string().trim().required().min(MIN).max(MAX),
    device_token: Joi.string().trim().optional().max(300),
    login_type: Joi.number().max(1),
  }),
  socialData: Joi.object({
    social_id: Joi.string().trim().required().max(300),
    email: Joi.string().trim().allow(null).email().max(60),
    name: Joi.string().allow(null).max(40),
    device_token: Joi.string().trim().optional().max(300),
    login_type: Joi.number().max(1),
    image: Joi.string().trim().required().max(5000),
  }),

  forgotPasswordData: Joi.object({
    email: Joi.string().trim().email().required().max(60),
  }),
  refreshTokenData: Joi.object({
    user_id: Joi.string().trim().required().max(500),
  }),
};

export default schema;
