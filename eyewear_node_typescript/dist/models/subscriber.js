"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subscriberSchema = new mongoose_1.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
    },
    status: {
        type: Number,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        default: 1,
    },
}, { timestamps: true, strict: true });
exports.default = (0, mongoose_1.model)('Subscriber', subscriberSchema);
