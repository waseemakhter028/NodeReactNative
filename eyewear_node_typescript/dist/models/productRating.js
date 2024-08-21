"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productRatingSchema = new mongoose_1.Schema({
    product_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    rating: {
        type: Number,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
    },
    comment: {
        type: String,
        trim: true,
    },
    status: {
        type: Number,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        default: 1,
    },
}, { timestamps: true, strict: true });
exports.default = (0, mongoose_1.model)('Product_Rating', productRatingSchema);
