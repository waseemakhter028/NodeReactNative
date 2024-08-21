import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import JSONResponse from '../response/JSONResponse';

function validationMiddleware(schema: Joi.Schema): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationOptions = {
      errors: {
        wrap: {
          label: '',
        },
      },
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      await schema.validateAsync({ ...req.body, ...req.params, ...req.query }, validationOptions);
      next();
    } catch (e: any) {
      const errors: string[] = [];
      e.details.forEach((error: Joi.ValidationErrorItem) => {
        errors.push(error.message);
      });
      return JSONResponse.error(res, errors[0], 200);
    }
  };
}

export default validationMiddleware;
