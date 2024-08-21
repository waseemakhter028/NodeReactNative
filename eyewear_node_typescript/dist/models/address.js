"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    address_type: {
        type: String,
        trim: true,
        required: true,
    },
    street: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        type: String,
        trim: true,
        required: true,
    },
    city: {
        type: String,
        trim: true,
        required: true,
    },
    state: {
        type: String,
        trim: true,
        required: true,
    },
    zipcode: {
        type: Number,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        required: true,
    },
    landmark: {
        type: String,
        trim: true,
        required: true,
    },
    country: {
        type: String,
        default: 'India',
    },
}, { timestamps: true, strict: true });
addressSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
addressSchema.set('toJSON', {
    virtuals: true,
});
exports.default = (0, mongoose_1.model)('Address', addressSchema);
