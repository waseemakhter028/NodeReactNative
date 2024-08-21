"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    total_amount: {
        type: Number,
    },
    transaction_detail: {
        type: Object,
        default: null,
    },
    payment_method: {
        type: String,
        trim: true,
        default: 'razorpay', // razorpay / coupon
    },
    status: {
        type: String,
        default: 'paid',
    },
}, { timestamps: true, strict: true });
exports.default = (0, mongoose_1.model)('Transaction', transactionSchema);
