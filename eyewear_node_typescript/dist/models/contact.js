"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true, strict: true });
exports.default = (0, mongoose_1.model)('Contact', contactSchema);
