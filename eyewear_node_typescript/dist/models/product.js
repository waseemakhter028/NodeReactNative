"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    image: {
        type: String,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
    },
    information: {
        type: String,
        trim: true,
        required: true,
    },
    qty: {
        type: Number,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        required: true,
    },
    status: {
        type: Number,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        default: 1,
    },
}, { timestamps: true, strict: true });
exports.productSchema = productSchema;
exports.default = (0, mongoose_1.model)('Product', productSchema);
