"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = {
    deliveryCharge: joi_1.default.object({
        total_amount: joi_1.default.number().required().max(200000),
    }),
    checkoutInfo: joi_1.default.object({
        user_id: joi_1.default.string().required().max(500),
    }),
    checkOrder: joi_1.default.object({
        user_id: joi_1.default.string().required().max(500),
    }),
    applyCoupon: joi_1.default.object({
        user_id: joi_1.default.string().required().max(500),
        coupon_code: joi_1.default.string().required().max(20),
    }),
    placeOrder: joi_1.default.object({
        user_id: joi_1.default.string().trim().required().max(500),
        payment_method: joi_1.default.string().trim().required().max(8),
        paymentId: joi_1.default.any().when('payment_method', {
            is: 'coupon',
            then: joi_1.default.optional(),
            otherwise: joi_1.default.string().trim().required().min(18).max(30),
        }),
        address_id: joi_1.default.string().trim().required().max(500),
        notes: joi_1.default.string().trim().max(500),
        coupon_code: joi_1.default.any().when('payment_method', {
            is: 'coupon',
            then: joi_1.default.string().required().max(12),
            otherwise: joi_1.default.optional(),
        }),
    }),
    orders: joi_1.default.object({
        user_id: joi_1.default.string().trim().required().max(500),
        status: joi_1.default.number().required().min(1).max(4),
        page: joi_1.default.number().required().min(1).max(999999999999999),
    }),
};
exports.default = schema;
