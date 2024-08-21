"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = {
    getCart: joi_1.default.object({
        user_id: joi_1.default.string().trim().required().max(500),
    }),
    addCart: joi_1.default.object({
        user_id: joi_1.default.string().trim().required().max(500),
        product_id: joi_1.default.string().trim().required().max(500),
        quantity: joi_1.default.number().required().max(20),
        size: joi_1.default.string().trim().max(2),
        color: joi_1.default.string().trim().max(20),
    }),
    updateCart: joi_1.default.object({
        id: joi_1.default.string().trim().required().max(500),
        quantity: joi_1.default.number().required().max(20),
    }),
    deleteCart: joi_1.default.object({
        id: joi_1.default.string().trim().required().max(500),
    }),
};
exports.default = schema;
