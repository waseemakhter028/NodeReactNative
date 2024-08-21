"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const root_controller_1 = __importDefault(require("./controllers/root.controller"));
// API Controllerss
const swagger_controller_1 = __importDefault(require("./controllers/swagger.controller"));
const address_controller_1 = __importDefault(require("./controllers/address.controller"));
const cart_controller_1 = __importDefault(require("./controllers/cart.controller"));
const category_controller_1 = __importDefault(require("./controllers/category.controller"));
const contact_controller_1 = __importDefault(require("./controllers/contact.controller"));
const coupon_controller_1 = __importDefault(require("./controllers/coupon.controller"));
const home_controller_1 = __importDefault(require("./controllers/home.controller"));
const invoice_controller_1 = __importDefault(require("./controllers/invoice.controller"));
const product_controller_1 = __importDefault(require("./controllers/product.controller"));
const subscriber_controler_1 = __importDefault(require("./controllers/subscriber.controler"));
const user_controller_1 = __importDefault(require("./controllers/user.controller"));
const order_controller_1 = __importDefault(require("./controllers/order.controller"));
const notification_controller_1 = __importDefault(require("./controllers/notification.controller"));
const profile_controller_1 = __importDefault(require("./controllers/profile.controller"));
const { PORT, HOST } = process.env;
const app = new app_1.default([
    new root_controller_1.default(),
    new swagger_controller_1.default(),
    new address_controller_1.default(),
    new cart_controller_1.default(),
    new category_controller_1.default(),
    new contact_controller_1.default(),
    new coupon_controller_1.default(),
    new home_controller_1.default(),
    new invoice_controller_1.default(),
    new product_controller_1.default(),
    new subscriber_controler_1.default(),
    new user_controller_1.default(),
    new order_controller_1.default(),
    new notification_controller_1.default(),
    new profile_controller_1.default(),
], Number(PORT), String(HOST));
app.listen();
