"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    order_id: {
        type: String,
        trim: true,
        required: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    transaction_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Transaction',
    },
    transaction_detail: {
        type: Object,
        default: null,
    },
    address_detail: {
        type: Object,
        default: null,
    },
    notes: {
        type: String,
        trim: true,
        default: null,
    },
    rated: {
        type: Number,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        default: 1, //1=rated, 0=not rated
    },
    delivery_charge: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        default: 1, // 1=placed 2=confirmed, 3=shipped, 4=delivered
    },
}, { timestamps: true, strict: true });
orderSchema.virtual('Transaction', {
    ref: 'Transaction',
    localField: 'transaction_id',
    foreignField: '_id',
});
exports.default = (0, mongoose_1.model)('Order', orderSchema);
