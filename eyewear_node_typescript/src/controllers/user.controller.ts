import { Router, Request, Response } from 'express';
import moment from 'moment';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validationSchema/user.validation';
import JSONResponse from '../response/JSONResponse';
import UserModel from '../models/user';
import CartModel from '../models/cart';
import { genrateUserToken, verifyToken } from '../middleware/auth';
import sendEmail from '../service/SendEmail';
import { rand, getTimezone } from '../utils/common';

class UserController implements Controller {
  public router = Router();
  private userModel = UserModel;
  private cartModel = CartModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(`/register`, validationMiddleware(validate.registerData), this.register);
    this.router.post(`/sendotp`, validationMiddleware(validate.otpData), this.resendOtp);
    this.router.post(`/verifyotp`, validationMiddleware(validate.verifyotpData), this.verifyOtp);
    this.router.post(`/sociallogin`, validationMiddleware(validate.socialData), this.socialLogin);
    this.router.post(`/login`, validationMiddleware(validate.loginData), this.login);
    this.router.post(`/logout`, this.logout);
    this.router.post(`/forgotpassword`, validationMiddleware(validate.forgotPasswordData), this.forgotPassword);
    this.router.post(`/refreshtoken`, validationMiddleware(validate.refreshTokenData), this.refreshToken);
  }

  private register = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { name, email, password, login_type } = req.body;

      const userExists = await this.userModel.findOne({ email: email }).select('email');

      if (userExists) return JSONResponse.error(res, 'Email already exists', 200);

      const user = await this.userModel.create({
        name: name,
        email: email,
        password: password,
        login_type: +login_type,
      });

      if (!user) return JSONResponse.error(res, 'Something is wrong', 200);

      const token = await genrateUserToken({
        email: user.email,
        userId: user._id,
      });

      const otp = rand(100000, 999999);

      await this.userModel.findOneAndUpdate({ _id: user._id }, { $set: { api_token: token, otp: otp } }, { new: true });

      //sending otp to user account
      sendEmail(user.email, 'Eyewear Account Verification', 'sendotp.ejs', {
        name: user.name,
        otp: otp,
      });

      return JSONResponse.success(res, {}, 'Successfully Register');
    } catch (e: any) {
      if (e.name === 'MongoError' && e.code === 11000) return JSONResponse.error(res, 'Email already exists', e.code);

      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private resendOtp = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email } = req.body;

      const user = await this.userModel
        .findOne({ email: email })
        .select('name email otp email_verified_status login_type');

      if (!user) return JSONResponse.error(res, 'Email Id not register with us', 200);
      else if (user.email_verified_status || user.login_type != 0) {
        return JSONResponse.error(res, 'Email already verified', 200);
      }

      const otp = rand(100000, 999999);

      // update user otp
      user.otp = otp;
      user.save();

      //sending otp to user account
      sendEmail(user.email, 'Eyewear Account Verification', 'sendotp.ejs', {
        name: user.name,
        otp: otp,
      });

      return JSONResponse.success(res, {}, 'OTP resend Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private verifyOtp = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, otp } = req.body;

    const user = await this.userModel
      .findOne({ email: email })
      .select('name email otp email_verified_at email_verified_status login_type');

    if (!user) {
      return JSONResponse.error(res, 'User not found', 200);
    }

    const timezone = getTimezone(req);

    const otpDate = moment.utc(user.updatedAt).tz(timezone);

    const curDate = moment.utc().tz(timezone);

    const diff = curDate.diff(otpDate, 'minutes');

    if (user?.email_verified_status || user?.login_type != 0) {
      return JSONResponse.error(res, 'account already verified', 200);
    }

    if (user.otp != otp) {
      return JSONResponse.error(res, 'Invalid OTP', 200);
    }
    //if otp older than 15 minutes user require to resend otp
    else if (diff >= 15) {
      return JSONResponse.error(res, 'OTP expired', 200);
    }

    // update user account verified
    user.otp = null;
    user.email_verified_at = moment().toISOString();
    user.email_verified_status = true;
    user.save();

    return JSONResponse.success(res, {}, 'OTP Verified Successfully!');
  };

  private login = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email, password, device_token } = req.body;

      const user = await this.userModel
        .findOne({ email: email, login_type: 0 })
        .populate({ path: 'carts', select: '_id' });

      if (!user) {
        return JSONResponse.error(res, 'Email not register', 200);
      } else if (!bcrypt.compareSync(password, user.password)) {
        return JSONResponse.error(res, 'Invalid Password', 200);
      } else if (!user.email_verified_status && user.login_type == 0) {
        return JSONResponse.error(res, 'Account not verified', 201);
      }

      // if checking old token not expired updating old token again else generating new token
      const token = !verifyToken(user.api_token ?? '')
        ? await genrateUserToken({ email: user?.email, userId: user?._id })
        : user.api_token;

      user.api_token = token;
      user.device_token = device_token;
      user.save();

      const data = {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        login_type: user?.login_type,
        api_token: user?.api_token,
        role: user?.role,
        image: user?.image,
        cartCount: user?.carts?.length,
      };

      return JSONResponse.success(res, data, 'Logged In Successfully');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private socialLogin = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, social_id, name, device_token, login_type, image } = req.body;

    try {
      let user = await this.userModel.findOne({ social_id: social_id });

      if (!user) {
        user = await this.userModel.create({
          name: name,
          email: email,
          login_type: +login_type,
          social_id: social_id,
          email_verified_status: true,
          email_verified_at: moment().toISOString(),
          image: image,
        });
      }

      // if checking old token not expired updating old token again else generating new token
      const token = !verifyToken(user.api_token ?? '')
        ? await genrateUserToken({ email: user?.email, userId: user?._id })
        : user.api_token;

      user.api_token = token;
      user.device_token = device_token;
      user.save();

      // loading cart collection for user
      await user.populate({ path: 'carts', select: '_id' });

      const data = {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        social_id: user?.social_id,
        login_type: user?.login_type,
        api_token: user?.api_token,
        role: user?.role,
        image: user?.image,
        cartCount: user?.carts?.length,
      };

      return JSONResponse.success(res, data, 'Logged In Successfully');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private logout = async (req: Request, res: Response): Promise<Response | void> => {
    const token = req.headers['Authorization'] || req.headers['authorization'];
    try {
      const user = await this.userModel.findOne({ api_token: token }).select('api_token device_token');
      if (!user) {
        return JSONResponse.success(res, {}, 'Logged Out Successfully');
      }

      // empty user api token
      user.api_token = null;
      user.device_token = null;
      user.save();

      return JSONResponse.success(res, {}, 'Logged Out Successfully');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private forgotPassword = async (req: Request, res: Response): Promise<Response | void> => {
    const { email } = req.body;

    try {
      const user = await this.userModel
        .findOne({ email: email })
        .select('name email password email_verified_status login_type');

      if (!user) {
        return JSONResponse.error(res, 'Email not register with us', 200);
      } else if (!user.email_verified_status && user.login_type === 0) {
        return JSONResponse.error(res, 'Account not verified', 200);
      } else if (user.login_type != 0) {
        return JSONResponse.error(res, 'Account not verified', 200);
      }

      const cap = _.shuffle('QWERTYUIOPASDFGHJKLMNBVCXZ').join('').substring(0, 2);

      const sma = _.shuffle('zxcvbnmqwertyuioplkjhgfdsa').join('').substring(0, 2);

      const spe = _.shuffle('@#$%&*').join('').substring(0, 2);

      const num = _.shuffle('9051836274').join('').substring(0, 2);

      const password = _.shuffle(cap + sma + spe + num).join('');

      // update hashpassword
      user.password = password;
      user.save();

      sendEmail(user.email, 'Eyewear Forgot Password', 'sendpassword.ejs', {
        name: user.name,
        password: password.trim(),
      });

      return JSONResponse.success(res, {}, 'Password sent on email successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private refreshToken = async (req: Request, res: Response): Promise<Response | void> => {
    const { user_id } = req.body;

    try {
      const user = await this.userModel.findById(user_id).populate({ path: 'carts', select: '_id' });

      if (!user) {
        return JSONResponse.error(res, 'Invalid User Id', 200);
      } else if (!user.email_verified_status && user.login_type === 0) {
        return JSONResponse.error(res, 'Account not verified', 200);
      }

      const token = await genrateUserToken({ email: user.email, userId: user._id });

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
        cartCount: user?.carts?.length,
      };

      return JSONResponse.success(res, data, 'Token refeshed successfully');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default UserController;
