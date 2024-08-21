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
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const address_validation_1 = __importDefault(require("../validationSchema/address.validation"));
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const user_1 = __importDefault(require("../models/user"));
const address_1 = __importDefault(require("../models/address"));
const auth_1 = require("../middleware/auth");
class AddressController {
    constructor() {
        this.path = '/address';
        this.router = (0, express_1.Router)();
        this.userModel = user_1.default;
        this.addressModel = address_1.default;
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = req.query;
                const user = yield this.userModel.findById(user_id).populate({ path: 'addresses' });
                if (!user)
                    return JSONResponse_1.default.error(res, 'User Not Found', 200);
                return JSONResponse_1.default.success(res, user.addresses, 'Address Fetched Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.save = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, address_type, street, address, landmark, city, state, zipcode } = req.body;
                const user = yield this.userModel.findById(user_id).populate({ path: 'addresses' });
                if (!user)
                    return JSONResponse_1.default.error(res, 'User Not Found', 200);
                const save = yield this.addressModel.create({
                    user_id: user_id,
                    address_type: address_type,
                    street: street,
                    address: address,
                    landmark: landmark,
                    city: city,
                    state: state,
                    zipcode: zipcode,
                });
                if (!save)
                    return JSONResponse_1.default.exception(res, 'Something is wrong', 200);
                return JSONResponse_1.default.success(res, user.addresses, 'Address Saved Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = yield this.addressModel.findById(id);
                return JSONResponse_1.default.success(res, data, 'Address Fetched Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, address_type, street, address, landmark, city, state, zipcode } = req.body;
                const { id } = req.params;
                const save = yield this.addressModel.findByIdAndUpdate(id, {
                    user_id,
                    address_type,
                    street,
                    address,
                    landmark,
                    city,
                    state,
                    zipcode,
                });
                if (!save)
                    return JSONResponse_1.default.exception(res, 'Something is wrong', 200);
                return JSONResponse_1.default.success(res, {}, 'Address Updated Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const del = yield address_1.default.findByIdAndDelete(id);
                if (!del)
                    return JSONResponse_1.default.exception(res, 'Something is wrong', 200);
                const user = yield this.userModel.findById(del.user_id).populate({ path: 'addresses' });
                return JSONResponse_1.default.success(res, user === null || user === void 0 ? void 0 : user.addresses, 'Address Deleted Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`${this.path}`, auth_1.authenticate, (0, validation_middleware_1.default)(address_validation_1.default.getAddress), this.index);
        this.router.post(`${this.path}/add`, auth_1.authenticate, (0, validation_middleware_1.default)(address_validation_1.default.addAddress), this.save);
        this.router.get(`${this.path}/:id`, auth_1.authenticate, (0, validation_middleware_1.default)(address_validation_1.default.showAddress), this.show);
        this.router.put(`${this.path}/:id`, auth_1.authenticate, (0, validation_middleware_1.default)(address_validation_1.default.updateAddress), this.update);
        this.router.delete(`${this.path}/:id`, auth_1.authenticate, (0, validation_middleware_1.default)(address_validation_1.default.deleteAddress), this.delete);
    }
}
exports.default = AddressController;
