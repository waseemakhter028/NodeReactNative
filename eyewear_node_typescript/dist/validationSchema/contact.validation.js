"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const common_1 = require("../constant/common");
const schema = {
    saveContactData: joi_1.default.object({
        name: joi_1.default.string().trim().required().max(40),
        email: joi_1.default.string().trim().email().required().max(60),
        message: joi_1.default.string().trim().required().max(500),
        phone: joi_1.default.string().trim().required().pattern(new RegExp(common_1.numbers_validation_regex)).min(10).max(10),
    }),
};
exports.default = schema;
