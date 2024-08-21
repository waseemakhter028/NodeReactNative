import { Response } from 'express';
class JSONResponse {
  static success<T>(res: Response, data: T, message: string, success = true, status = 200): void {
    const errorCode = 200;
    res.status(errorCode || 200).json({
      statusCode: status,
      success: success,
      message: message,
      data: data,
    });
  }

  static error(res: Response, message: string, status = 200): void {
    res.status(status).json({
      statusCode: status,
      success: false,
      message: message,
    });
  }

  static exception(res: Response, message: string, status = 200): void {
    const errorCode = 200;
    res.status(errorCode || 200).json({
      statusCode: status,
      success: false,
      message: 'Exception: ' + message,
    });
  }

  static serverError(req: Request, res: Response, message: string, data: any): void {
    res.status(500).json({
      code: 500,
      message: message || 'internal server error',
      data: data,
    });
  }
}

export default JSONResponse;
