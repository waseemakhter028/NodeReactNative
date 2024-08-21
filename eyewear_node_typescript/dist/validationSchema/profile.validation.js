"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const common_1 = require("../constant/common");
const { MIN, MAX } = common_1.PASSWORD;
const schema = {
    changePassword: joi_1.default.object({
        current_password: joi_1.default.string()
            .trim()
            .required()
            .min(MIN)
            .max(MAX)
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/)
            .messages({
            'string.pattern.base': 'Must contain minimum 8 characters, at least one upper case letter, one number and one special character',
        }),
        new_password: joi_1.default.string()
            .trim()
            .required()
            .min(MIN)
            .max(MAX)
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/)
            .messages({
            'string.pattern.base': 'Must contain minimum 8 characters, at least one upper case letter, one number and one special character',
        }),
        confirm_password: joi_1.default.string()
            .trim()
            .equal(joi_1.default.ref('new_password'))
            .required()
            .min(MIN)
            .max(MAX)
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/)
            .messages({
            'string.pattern.base': 'Must contain minimum 8 characters, at least one upper case letter, one number and one special character',
            'any.only': 'Confirm password must match the new password',
        }),
    }),
};
exports.default = schema;
