import { Request, Response } from 'express';

const errorPageNotMiddleware = (request: Request, response: Response) => {
  const status = 404;
  const message = 'Page not found';
  response.status(status).json({
    status,
    message,
  });
};

const genericErrorHandler = (err: any, req: Request, res: Response) => {
  let error;
  console.log(err.message);

  if (err.status === undefined && err?.response?.data) {
    ({ error } = err.response.data);
  } else if (err.status === 405) {
    error = {
      code: err.status,
      message: 'method not allowed',
      lineNumber: err.stack,
    };
  } else if (err.status < 500) {
    error = {
      code: err.status,
      message: err.message,
      lineNumber: err.stack,
    };
  } else {
    // Return INTERNAL_SERVER_ERROR for all other cases
    error = {
      code: 500,
      message: err.message,
      lineNumber: err.stack,
    };
  }

  if (process.env.NODE_ENV === 'production' && err.status === 500) {
    error = {
      code: error.code,
      message: 'Something is wrong',
    };
  }

  res.status(error.code).json({ error });
};

export { errorPageNotMiddleware, genericErrorHandler };
