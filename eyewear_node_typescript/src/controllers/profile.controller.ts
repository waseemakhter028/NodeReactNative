import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UploadedFile } from 'express-fileupload';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validationSchema/profile.validation';
import JSONResponse from '../response/JSONResponse';
import UserModel from '../models/user';
import CartModel from '../models/cart';
import fileUploadExpress from '../middleware/fileUpload';
import { authenticate } from '../middleware/auth';
import { getAuthorization } from '../utils/common';

class ProfileController implements Controller {
  public router = Router();
  private userModel = UserModel;
  private cartModel = CartModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(`/uploadimage`, authenticate, this.saveUserImage);
    this.router.post(
      `/changepassword`,
      authenticate,
      validationMiddleware(validate.changePassword),
      this.changePassword,
    );
  }

  private saveUserImage = async (req: Request, res: Response): Promise<Response | void> => {
    if (!req.files) {
      return JSONResponse.error(res, 'Please select file', 200);
    }
    try {
      const user = await this.userModel
        .findOne({ api_token: getAuthorization(req) })
        .populate({ path: 'carts', select: '_id' });

      if (!user) return JSONResponse.error(res, 'User not found', 200);

      const file = req.files.photo as UploadedFile;

      const directory = 'public/users';

      const isValidFile = await fileUploadExpress({
        filename: file.name,
        data: file.data,
        directory: directory,
        size: file.size,
        dbFileName: user.image ?? '',
      });
      if (isValidFile.status !== 'success') {
        return JSONResponse.error(res, isValidFile.message ?? '', 200);
      }

      const imageName = isValidFile.imageName;

      user.image = isValidFile.imageName;
      const updateImage = await user.save();

      if (!updateImage) {
        return JSONResponse.error(res, 'File not uploaded try again', 200);
      }

      file.mv(`${directory}/` + imageName);

      const cartCount = user?.carts?.length;

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
      return JSONResponse.success(res, data, 'File Uploaded Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private changePassword = async (req: Request, res: Response): Promise<Response | void> => {
    const { current_password, confirm_password } = req.body;
    try {
      const user = await this.userModel.findOne({
        api_token: getAuthorization(req),
      });

      if (!user) return JSONResponse.error(res, 'User Not Found', 200);

      if (!bcrypt.compareSync(current_password, user.password)) {
        return JSONResponse.error(res, 'Invalid Password', 200);
      }

      if (current_password === confirm_password) {
        return JSONResponse.error(res, 'New password cannot be same as old paasword', 200);
      }

      user.password = confirm_password;

      const updatePassword = await user.save();
      if (!updatePassword) {
        return JSONResponse.error(res, 'Please try again after sometime', 200);
      }

      return JSONResponse.success(res, {}, 'Password Changed Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default ProfileController;
