import { Router, Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';
import JSONResponse from '../response/JSONResponse';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validationSchema/subscriber.validation';
import SubscriberModel from '../models/subscriber';
import sendEmail from '../service/SendEmail';

class SubscriberController implements Controller {
  public router = Router();
  private subscriberModel = SubscriberModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(`/subscribe`, validationMiddleware(validate.saveSubscriberData), this.save);
  }

  private save = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email } = req.body;
      const subscribe = await this.subscriberModel.findOne({ email });

      if (subscribe) return JSONResponse.error(res, 'Already subscribed!', 200);

      const save = await this.subscriberModel.create({ email });

      if (!save) return JSONResponse.error(res, 'Something is wrong try again!', 200);

      sendEmail(email, 'Eyewear New Letter', 'subscriber.ejs');

      return JSONResponse.success(res, {}, 'New letter subscribed Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default SubscriberController;
