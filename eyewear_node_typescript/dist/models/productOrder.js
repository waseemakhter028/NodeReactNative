"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productOrderSchema = new mongoose_1.Schema({
    order_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
    },
    product_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        default: 1,
    },
    size: {
        type: String,
        default: 'M',
    },
    color: {
        type: String,
        default: '#B11D1D',
    },
}, { timestamps: true, strict: true });
exports.default = (0, mongoose_1.model)('Product_Order', productOrderSchema);
