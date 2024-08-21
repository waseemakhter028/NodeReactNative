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
const bcrypt_1 = __importDefault(require("bcrypt"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const profile_validation_1 = __importDefault(require("../validationSchema/profile.validation"));
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const user_1 = __importDefault(require("../models/user"));
const cart_1 = __importDefault(require("../models/cart"));
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const auth_1 = require("../middleware/auth");
const common_1 = require("../utils/common");
class ProfileController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userModel = user_1.default;
        this.cartModel = cart_1.default;
        this.saveUserImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!req.files) {
                return JSONResponse_1.default.error(res, 'Please select file', 200);
            }
            try {
                const user = yield this.userModel
                    .findOne({ api_token: (0, common_1.getAuthorization)(req) })
                    .populate({ path: 'carts', select: '_id' });
                if (!user)
                    return JSONResponse_1.default.error(res, 'User not found', 200);
                const file = req.files.photo;
                const directory = 'public/users';
                const isValidFile = yield (0, fileUpload_1.default)({
                    filename: file.name,
                    data: file.data,
                    directory: directory,
                    size: file.size,
                    dbFileName: (_a = user.image) !== null && _a !== void 0 ? _a : '',
                });
                if (isValidFile.status !== 'success') {
                    return JSONResponse_1.default.error(res, (_b = isValidFile.message) !== null && _b !== void 0 ? _b : '', 200);
                }
                const imageName = isValidFile.imageName;
                user.image = isValidFile.imageName;
                const updateImage = yield user.save();
                if (!updateImage) {
                    return JSONResponse_1.default.error(res, 'File not uploaded try again', 200);
                }
                file.mv(`${directory}/` + imageName);
                const cartCount = (_c = user === null || user === void 0 ? void 0 : user.carts) === null || _c === void 0 ? void 0 : _c.length;
                const data = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    social_id: user.social_id,
                    login_type: user.login_type,
                    api_token: user.api_token,
                    role: user.role,
                    image: imageName,
                    cartCount: cartCount,
                };
                return JSONResponse_1.default.success(res, data, 'File Uploaded Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { current_password, confirm_password } = req.body;
            try {
                const user = yield this.userModel.findOne({
                    api_token: (0, common_1.getAuthorization)(req),
                });
                if (!user)
                    return JSONResponse_1.default.error(res, 'User Not Found', 200);
                if (!bcrypt_1.default.compareSync(current_password, user.password)) {
                    return JSONResponse_1.default.error(res, 'Invalid Password', 200);
                }
                if (current_password === confirm_password) {
                    return JSONResponse_1.default.error(res, 'New password cannot be same as old paasword', 200);
                }
                user.password = confirm_password;
                const updatePassword = yield user.save();
                if (!updatePassword) {
                    return JSONResponse_1.default.error(res, 'Please try again after sometime', 200);
                }
                return JSONResponse_1.default.success(res, {}, 'Password Changed Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`/uploadimage`, auth_1.authenticate, this.saveUserImage);
        this.router.post(`/changepassword`, auth_1.authenticate, (0, validation_middleware_1.default)(profile_validation_1.default.changePassword), this.changePassword);
    }
}
exports.default = ProfileController;
