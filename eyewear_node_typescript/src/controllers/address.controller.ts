import { Router, Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validationSchema/address.validation';
import JSONResponse from '../response/JSONResponse';
import UserModel from '../models/user';
import AddressModel from '../models/address';
import { authenticate } from '../middleware/auth';

class AddressController implements Controller {
  public path = '/address';
  public router = Router();
  private userModel = UserModel;
  private addressModel = AddressModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}`, authenticate, validationMiddleware(validate.getAddress), this.index);
    this.router.post(`${this.path}/add`, authenticate, validationMiddleware(validate.addAddress), this.save);
    this.router.get(`${this.path}/:id`, authenticate, validationMiddleware(validate.showAddress), this.show);
    this.router.put(`${this.path}/:id`, authenticate, validationMiddleware(validate.updateAddress), this.update);
    this.router.delete(`${this.path}/:id`, authenticate, validationMiddleware(validate.deleteAddress), this.delete);
  }

  private index = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { user_id } = req.query;
      const user = await this.userModel.findById(user_id).populate({ path: 'addresses' });

      if (!user) return JSONResponse.error(res, 'User Not Found', 200);

      return JSONResponse.success(res, user.addresses, 'Address Fetched Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private save = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { user_id, address_type, street, address, landmark, city, state, zipcode } = req.body;

      const user = await this.userModel.findById(user_id).populate({ path: 'addresses' });

      if (!user) return JSONResponse.error(res, 'User Not Found', 200);

      const save = await this.addressModel.create({
        user_id: user_id,
        address_type: address_type,
        street: street,
        address: address,
        landmark: landmark,
        city: city,
        state: state,
        zipcode: zipcode,
      });

      if (!save) return JSONResponse.exception(res, 'Something is wrong', 200);

      return JSONResponse.success(res, user.addresses, 'Address Saved Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private show = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { id } = req.params;

      const data = await this.addressModel.findById(id);

      return JSONResponse.success(res, data, 'Address Fetched Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private update = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { user_id, address_type, street, address, landmark, city, state, zipcode } = req.body;
      const { id } = req.params;

      const save = await this.addressModel.findByIdAndUpdate(id, {
        user_id,
        address_type,
        street,
        address,
        landmark,
        city,
        state,
        zipcode,
      });

      if (!save) return JSONResponse.exception(res, 'Something is wrong', 200);

      return JSONResponse.success(res, {}, 'Address Updated Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private delete = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { id } = req.params;

      const del = await AddressModel.findByIdAndDelete(id);

      if (!del) return JSONResponse.exception(res, 'Something is wrong', 200);

      const user = await this.userModel.findById(del.user_id).populate({ path: 'addresses' });

      return JSONResponse.success(res, user?.addresses, 'Address Deleted Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default AddressController;
