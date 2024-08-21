"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = {
    getAddress: joi_1.default.object({
        user_id: joi_1.default.string().trim().required().max(500),
    }),
    addAddress: joi_1.default.object({
        id: joi_1.default.string().allow(null).max(40),
        user_id: joi_1.default.string().trim().required().max(500),
        street: joi_1.default.string().trim().required().max(20),
        address_type: joi_1.default.string().trim().required().max(20),
        address: joi_1.default.string().trim().required().max(40),
        landmark: joi_1.default.string().trim().required().max(40),
        state: joi_1.default.string().trim().required().max(20),
        city: joi_1.default.string().trim().required().max(20),
        zipcode: joi_1.default.number().required().max(999999),
    }),
    showAddress: joi_1.default.object({
        id: joi_1.default.string().trim().required().max(500),
    }),
    updateAddress: joi_1.default.object({
        id: joi_1.default.any().required(),
        user_id: joi_1.default.string().trim().required().max(500),
        street: joi_1.default.string().trim().required().max(20),
        address_type: joi_1.default.string().trim().required().max(20),
        address: joi_1.default.string().trim().required().max(40),
        landmark: joi_1.default.string().trim().required().max(40),
        state: joi_1.default.string().trim().required().max(20),
        city: joi_1.default.string().trim().required().max(20),
        zipcode: joi_1.default.number().required().max(999999),
    }),
    deleteAddress: joi_1.default.object({
        id: joi_1.default.string().trim().required().max(500),
    }),
};
exports.default = schema;
