"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const common_1 = require("../constant/common");
const { MIN, MAX } = common_1.PASSWORD;
const schema = {
    registerData: joi_1.default.object({
        name: joi_1.default.string().trim().required().max(40),
        email: joi_1.default.string().trim().email().required().max(60),
        password: joi_1.default.string().trim().required().min(MIN).max(MAX),
        login_type: joi_1.default.number().required().max(1),
    }),
    otpData: joi_1.default.object({
        email: joi_1.default.string().trim().email().required().max(60),
    }),
    verifyotpData: joi_1.default.object({
        email: joi_1.default.string().trim().email().required().max(60),
        otp: joi_1.default.number().integer().required().min(111111).max(999999),
    }),
    loginData: joi_1.default.object({
        email: joi_1.default.string().trim().email().required().max(60),
        password: joi_1.default.string().trim().required().min(MIN).max(MAX),
        device_token: joi_1.default.string().trim().optional().max(300),
        login_type: joi_1.default.number().max(1),
    }),
    socialData: joi_1.default.object({
        social_id: joi_1.default.string().trim().required().max(300),
        email: joi_1.default.string().trim().allow(null).email().max(60),
        name: joi_1.default.string().allow(null).max(40),
        device_token: joi_1.default.string().trim().optional().max(300),
        login_type: joi_1.default.number().max(1),
        image: joi_1.default.string().trim().required().max(5000),
    }),
    forgotPasswordData: joi_1.default.object({
        email: joi_1.default.string().trim().email().required().max(60),
    }),
    refreshTokenData: joi_1.default.object({
        user_id: joi_1.default.string().trim().required().max(500),
    }),
};
exports.default = schema;
