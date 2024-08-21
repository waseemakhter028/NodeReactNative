import { Router, Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validationSchema/cart.validation';
import JSONResponse from '../response/JSONResponse';
import UserModel from '../models/user';
import CartModel from '../models/cart';
import ProductModel from '../models/product';
import { authenticate } from '../middleware/auth';

class CartController implements Controller {
  public path = '/carts';
  public router = Router();
  private userModel = UserModel;
  private cartModel = CartModel;
  private productModel = ProductModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}`, authenticate, validationMiddleware(validate.getCart), this.index);
    this.router.post(`${this.path}`, authenticate, validationMiddleware(validate.addCart), this.save);
    this.router.put(`${this.path}/:id`, authenticate, validationMiddleware(validate.updateCart), this.update);
    this.router.delete(`${this.path}/:id`, authenticate, validationMiddleware(validate.deleteCart), this.delete);
  }

  private index = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { user_id } = req.query;
      const user = await this.userModel.findById(user_id).populate({
        path: 'carts',
        select: 'id user_id quantity size color',
        populate: {
          path: 'product_id',
          select: '_id image name price',
          options: { sort: { created_at: -1 } },
        },
      });

      if (!user) return JSONResponse.error(res, 'User Not Found', 200);

      return JSONResponse.success(res, user.carts, 'Address Fetched Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private save = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { user_id, quantity, product_id, size, color } = req.body;

      const product = await this.productModel.findById(product_id).select('_id qty');

      const user = await this.userModel.findById(user_id).select('email');

      if (!user) return JSONResponse.error(res, 'User Not Found', 200);
      else if (!product) return JSONResponse.error(res, 'Product Not Found', 200);
      else if (product.qty < 1) return JSONResponse.error(res, 'Product Out Of Stock', 200);

      const save = await this.cartModel.create({
        user_id: user_id,
        quantity: quantity,
        product_id: product_id,
        size: size,
        color: color,
      });

      if (!save) return JSONResponse.exception(res, 'Something is wrong', 200);

      return JSONResponse.success(res, {}, 'Item add to cart Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private update = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { quantity } = req.body;
      const { id } = req.params;

      const save = await this.cartModel.findByIdAndUpdate(id, { quantity: quantity });

      if (!save) return JSONResponse.exception(res, 'Something is wrong', 200);

      return JSONResponse.success(res, {}, 'Cart Updated Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private delete = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { id } = req.params;

      const save = await this.cartModel.findByIdAndDelete(id);

      if (!save) return JSONResponse.exception(res, 'Something is wrong', 200);

      return JSONResponse.success(res, {}, 'Cart Deleted Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default CartController;
