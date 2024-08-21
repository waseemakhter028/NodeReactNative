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
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const subscriber_validation_1 = __importDefault(require("../validationSchema/subscriber.validation"));
const subscriber_1 = __importDefault(require("../models/subscriber"));
const SendEmail_1 = __importDefault(require("../service/SendEmail"));
class SubscriberController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.subscriberModel = subscriber_1.default;
        this.save = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const subscribe = yield this.subscriberModel.findOne({ email });
                if (subscribe)
                    return JSONResponse_1.default.error(res, 'Already subscribed!', 200);
                const save = yield this.subscriberModel.create({ email });
                if (!save)
                    return JSONResponse_1.default.error(res, 'Something is wrong try again!', 200);
                (0, SendEmail_1.default)(email, 'Eyewear New Letter', 'subscriber.ejs');
                return JSONResponse_1.default.success(res, {}, 'New letter subscribed Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`/subscribe`, (0, validation_middleware_1.default)(subscriber_validation_1.default.saveSubscriberData), this.save);
    }
}
exports.default = SubscriberController;
