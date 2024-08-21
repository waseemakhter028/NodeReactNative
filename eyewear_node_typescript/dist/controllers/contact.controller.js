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
const striptags_1 = __importDefault(require("striptags"));
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const contact_validation_1 = __importDefault(require("../validationSchema/contact.validation"));
const contact_1 = __importDefault(require("../models/contact"));
class ContactController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.contactModel = contact_1.default;
        this.save = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, message } = req.body;
                const safeMessage = (0, striptags_1.default)(message);
                const save = yield this.contactModel.create({
                    name,
                    phone,
                    email,
                    message: safeMessage,
                });
                if (!save)
                    return JSONResponse_1.default.error(res, 'Something is wrong try again!', 200);
                return JSONResponse_1.default.success(res, {}, 'Contact data saved Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`/contact`, (0, validation_middleware_1.default)(contact_validation_1.default.saveContactData), this.save);
    }
}
exports.default = ContactController;
