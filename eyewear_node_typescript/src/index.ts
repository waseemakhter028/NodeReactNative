import 'dotenv/config';
import App from './app';
import RootController from './controllers/root.controller';
// API Controllerss
import SwaggerController from './controllers/swagger.controller';
import AddressController from './controllers/address.controller';
import CartController from './controllers/cart.controller';
import CategoryController from './controllers/category.controller';
import ContactController from './controllers/contact.controller';
import CouponController from './controllers/coupon.controller';
import HomeController from './controllers/home.controller';
import InvoiceController from './controllers/invoice.controller';
import ProductController from './controllers/product.controller';
import SubscriberController from './controllers/subscriber.controler';
import UserController from './controllers/user.controller';
import OrderController from './controllers/order.controller';
import NotificationController from './controllers/notification.controller';
import ProfileController from './controllers/profile.controller';

const { PORT, HOST } = process.env;

const app = new App(
  [
    new RootController(),
    new SwaggerController(),
    new AddressController(),
    new CartController(),
    new CategoryController(),
    new ContactController(),
    new CouponController(),
    new HomeController(),
    new InvoiceController(),
    new ProductController(),
    new SubscriberController(),
    new UserController(),
    new OrderController(),
    new NotificationController(),
    new ProfileController(),
  ],
  Number(PORT),
  String(HOST),
);

app.listen();
