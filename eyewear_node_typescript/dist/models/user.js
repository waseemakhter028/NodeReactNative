"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const common_1 = require("../constant/common");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        default: null,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    email_verified_at: {
        type: Date,
        default: null,
    },
    email_verified_status: {
        type: Boolean,
        default: false,
    },
    api_token: {
        type: String,
        trim: true,
        default: null,
    },
    otp: {
        type: Number,
        integer: true,
        trim: true,
        index: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        default: null,
    },
    role: {
        type: Number,
        integer: true,
        default: 0, // 0=user, 1=admin
    },
    device_token: {
        type: String,
        default: null,
    },
    social_id: {
        type: String, //incase of social login
        default: null,
    },
    login_type: {
        type: Number, // 0=normal, 1=google, 2=facebook
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        default: 0,
    },
    image: {
        type: String, //incase of social login
        default: null,
    },
    status: {
        type: Number,
        integer: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        default: 1,
    },
}, { timestamps: true, strict: true });
userSchema.virtual('addresses', {
    ref: 'Address',
    localField: '_id',
    foreignField: 'user_id',
});
userSchema.virtual('carts', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'user_id',
});
userSchema.virtual('notifications', {
    ref: 'Notification',
    localField: '_id',
    foreignField: 'user_id',
});
userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user_id',
});
userSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.name = lodash_1.default.upperFirst(lodash_1.default.toLower(this.name));
    }
    // saving hash password to db
    if (this.isModified('password')) {
        const salt = bcrypt_1.default.genSaltSync(common_1.PASSWORD.SALT_LENGTH);
        this.password = bcrypt_1.default.hashSync(this.password.trim(), salt);
    }
    next();
});
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.password;
    },
});
exports.default = (0, mongoose_1.model)('User', userSchema);
