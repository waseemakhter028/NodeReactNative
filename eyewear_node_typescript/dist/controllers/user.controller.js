"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = __importDefault(require("lodash"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const user_validation_1 = __importDefault(require("../validationSchema/user.validation"));
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const user_1 = __importDefault(require("../models/user"));
const cart_1 = __importDefault(require("../models/cart"));
const auth_1 = require("../middleware/auth");
const SendEmail_1 = __importDefault(require("../service/SendEmail"));
const common_1 = require("../utils/common");
class UserController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userModel = user_1.default;
        this.cartModel = cart_1.default;
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, login_type } = req.body;
                const userExists = yield this.userModel.findOne({ email: email }).select('email');
                if (userExists)
                    return JSONResponse_1.default.error(res, 'Email already exists', 200);
                const user = yield this.userModel.create({
                    name: name,
                    email: email,
                    password: password,
                    login_type: +login_type,
                });
                if (!user)
                    return JSONResponse_1.default.error(res, 'Something is wrong', 200);
                const token = yield (0, auth_1.genrateUserToken)({
                    email: user.email,
                    userId: user._id,
                });
                const otp = (0, common_1.rand)(100000, 999999);
                yield this.userModel.findOneAndUpdate({ _id: user._id }, { $set: { api_token: token, otp: otp } }, { new: true });
                //sending otp to user account
                (0, SendEmail_1.default)(user.email, 'Eyewear Account Verification', 'sendotp.ejs', {
                    name: user.name,
                    otp: otp,
                });
                return JSONResponse_1.default.success(res, {}, 'Successfully Register');
            }
            catch (e) {
                if (e.name === 'MongoError' && e.code === 11000)
                    return JSONResponse_1.default.error(res, 'Email already exists', e.code);
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.resendOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.userModel
                    .findOne({ email: email })
                    .select('name email otp email_verified_status login_type');
                if (!user)
                    return JSONResponse_1.default.error(res, 'Email Id not register with us', 200);
                else if (user.email_verified_status || user.login_type != 0) {
                    return JSONResponse_1.default.error(res, 'Email already verified', 200);
                }
                const otp = (0, common_1.rand)(100000, 999999);
                // update user otp
                user.otp = otp;
                user.save();
                //sending otp to user account
                (0, SendEmail_1.default)(user.email, 'Eyewear Account Verification', 'sendotp.ejs', {
                    name: user.name,
                    otp: otp,
                });
                return JSONResponse_1.default.success(res, {}, 'OTP resend Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.verifyOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            const user = yield this.userModel
                .findOne({ email: email })
                .select('name email otp email_verified_at email_verified_status login_type');
            if (!user) {
                return JSONResponse_1.default.error(res, 'User not found', 200);
            }
            const timezone = (0, common_1.getTimezone)(req);
            const otpDate = moment_1.default.utc(user.updatedAt).tz(timezone);
            const curDate = moment_1.default.utc().tz(timezone);
            const diff = curDate.diff(otpDate, 'minutes');
            if ((user === null || user === void 0 ? void 0 : user.email_verified_status) || (user === null || user === void 0 ? void 0 : user.login_type) != 0) {
                return JSONResponse_1.default.error(res, 'account already verified', 200);
            }
            if (user.otp != otp) {
                return JSONResponse_1.default.error(res, 'Invalid OTP', 200);
            }
            //if otp older than 15 minutes user require to resend otp
            else if (diff >= 15) {
                return JSONResponse_1.default.error(res, 'OTP expired', 200);
            }
            // update user account verified
            user.otp = null;
            user.email_verified_at = (0, moment_1.default)().toISOString();
            user.email_verified_status = true;
            user.save();
            return JSONResponse_1.default.success(res, {}, 'OTP Verified Successfully!');
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { email, password, device_token } = req.body;
                const user = yield this.userModel
                    .findOne({ email: email, login_type: 0 })
                    .populate({ path: 'carts', select: '_id' });
                if (!user) {
                    return JSONResponse_1.default.error(res, 'Email not register', 200);
                }
                else if (!bcrypt_1.default.compareSync(password, user.password)) {
                    return JSONResponse_1.default.error(res, 'Invalid Password', 200);
                }
                else if (!user.email_verified_status && user.login_type == 0) {
                    return JSONResponse_1.default.error(res, 'Account not verified', 201);
                }
                // if checking old token not expired updating old token again else generating new token
                const token = !(0, auth_1.verifyToken)((_a = user.api_token) !== null && _a !== void 0 ? _a : '')
                    ? yield (0, auth_1.genrateUserToken)({ email: user === null || user === void 0 ? void 0 : user.email, userId: user === null || user === void 0 ? void 0 : user._id })
                    : user.api_token;
                user.api_token = token;
                user.device_token = device_token;
                user.save();
                const data = {
                    id: user === null || user === void 0 ? void 0 : user._id,
                    name: user === null || user === void 0 ? void 0 : user.name,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    login_type: user === null || user === void 0 ? void 0 : user.login_type,
                    api_token: user === null || user === void 0 ? void 0 : user.api_token,
                    role: user === null || user === void 0 ? void 0 : user.role,
                    image: user === null || user === void 0 ? void 0 : user.image,
                    cartCount: (_b = user === null || user === void 0 ? void 0 : user.carts) === null || _b === void 0 ? void 0 : _b.length,
                };
                return JSONResponse_1.default.success(res, data, 'Logged In Successfully');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.socialLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { email, social_id, name, device_token, login_type, image } = req.body;
            try {
                let user = yield this.userModel.findOne({ social_id: social_id });
                if (!user) {
                    user = yield this.userModel.create({
                        name: name,
                        email: email,
                        login_type: +login_type,
                        social_id: social_id,
                        email_verified_status: true,
                        email_verified_at: (0, moment_1.default)().toISOString(),
                        image: image,
                    });
                }
                // if checking old token not expired updating old token again else generating new token
                const token = !(0, auth_1.verifyToken)((_a = user.api_token) !== null && _a !== void 0 ? _a : '')
                    ? yield (0, auth_1.genrateUserToken)({ email: user === null || user === void 0 ? void 0 : user.email, userId: user === null || user === void 0 ? void 0 : user._id })
                    : user.api_token;
                user.api_token = token;
                user.device_token = device_token;
                user.save();
                // loading cart collection for user
                yield user.populate({ path: 'carts', select: '_id' });
                const data = {
                    id: user === null || user === void 0 ? void 0 : user._id,
                    name: user === null || user === void 0 ? void 0 : user.name,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    social_id: user === null || user === void 0 ? void 0 : user.social_id,
                    login_type: user === null || user === void 0 ? void 0 : user.login_type,
                    api_token: user === null || user === void 0 ? void 0 : user.api_token,
                    role: user === null || user === void 0 ? void 0 : user.role,
                    image: user === null || user === void 0 ? void 0 : user.image,
                    cartCount: (_b = user === null || user === void 0 ? void 0 : user.carts) === null || _b === void 0 ? void 0 : _b.length,
                };
                return JSONResponse_1.default.success(res, data, 'Logged In Successfully');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.headers['Authorization'] || req.headers['authorization'];
            try {
                const user = yield this.userModel.findOne({ api_token: token }).select('api_token device_token');
                if (!user) {
                    return JSONResponse_1.default.success(res, {}, 'Logged Out Successfully');
                }
                // empty user api token
                user.api_token = null;
                user.device_token = null;
                user.save();
                return JSONResponse_1.default.success(res, {}, 'Logged Out Successfully');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield this.userModel
                    .findOne({ email: email })
                    .select('name email password email_verified_status login_type');
                if (!user) {
                    return JSONResponse_1.default.error(res, 'Email not register with us', 200);
                }
                else if (!user.email_verified_status && user.login_type === 0) {
                    return JSONResponse_1.default.error(res, 'Account not verified', 200);
                }
                else if (user.login_type != 0) {
                    return JSONResponse_1.default.error(res, 'Account not verified', 200);
                }
                const cap = lodash_1.default.shuffle('QWERTYUIOPASDFGHJKLMNBVCXZ').join('').substring(0, 2);
                const sma = lodash_1.default.shuffle('zxcvbnmqwertyuioplkjhgfdsa').join('').substring(0, 2);
                const spe = lodash_1.default.shuffle('@#$%&*').join('').substring(0, 2);
                const num = lodash_1.default.shuffle('9051836274').join('').substring(0, 2);
                const password = lodash_1.default.shuffle(cap + sma + spe + num).join('');
                // update hashpassword
                user.password = password;
                user.save();
                (0, SendEmail_1.default)(user.email, 'Eyewear Forgot Password', 'sendpassword.ejs', {
                    name: user.name,
                    password: password.trim(),
                });
                return JSONResponse_1.default.success(res, {}, 'Password sent on email successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { user_id } = req.body;
            try {
                const user = yield this.userModel.findById(user_id).populate({ path: 'carts', select: '_id' });
                if (!user) {
                    return JSONResponse_1.default.error(res, 'Invalid User Id', 200);
                }
                else if (!user.email_verified_status && user.login_type === 0) {
                    return JSONResponse_1.default.error(res, 'Account not verified', 200);
                }
                const token = yield (0, auth_1.genrateUserToken)({ email: user.email, userId: user._id });
                user.api_token = token;
                user.save();
                const data = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    login_type: user.login_type,
                    api_token: user.api_token,
                    role: user.role,
                    image: user.image,
                    cartCount: (_a = user === null || user === void 0 ? void 0 : user.carts) === null || _a === void 0 ? void 0 : _a.length,
                };
                return JSONResponse_1.default.success(res, data, 'Token refeshed successfully');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`/register`, (0, validation_middleware_1.default)(user_validation_1.default.registerData), this.register);
        this.router.post(`/sendotp`, (0, validation_middleware_1.default)(user_validation_1.default.otpData), this.resendOtp);
        this.router.post(`/verifyotp`, (0, validation_middleware_1.default)(user_validation_1.default.verifyotpData), this.verifyOtp);
        this.router.post(`/sociallogin`, (0, validation_middleware_1.default)(user_validation_1.default.socialData), this.socialLogin);
        this.router.post(`/login`, (0, validation_middleware_1.default)(user_validation_1.default.loginData), this.login);
        this.router.post(`/logout`, this.logout);
        this.router.post(`/forgotpassword`, (0, validation_middleware_1.default)(user_validation_1.default.forgotPasswordData), this.forgotPassword);
        this.router.post(`/refreshtoken`, (0, validation_middleware_1.default)(user_validation_1.default.refreshTokenData), this.refreshToken);
    }
}
exports.default = UserController;
