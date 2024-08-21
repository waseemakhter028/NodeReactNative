import { Router, Request, Response } from 'express';
import striptags from 'striptags';
import Controller from '../interfaces/controller.interface';
import JSONResponse from '../response/JSONResponse';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validationSchema/contact.validation';
import ContactModel from '../models/contact';

class ContactController implements Controller {
  public router = Router();
  private contactModel = ContactModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(`/contact`, validationMiddleware(validate.saveContactData), this.save);
  }

  private save = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { name, email, phone, message } = req.body;
      const safeMessage = striptags(message);

      const save = await this.contactModel.create({
        name,
        phone,
        email,
        message: safeMessage,
      });

      if (!save) return JSONResponse.error(res, 'Something is wrong try again!', 200);

      return JSONResponse.success(res, {}, 'Contact data saved Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default ContactController;
