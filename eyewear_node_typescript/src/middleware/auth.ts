import { Request, Response, NextFunction } from 'express';
import blueBirdPromise from 'bluebird';
import jsonwebtoken from 'jsonwebtoken';
import { settings } from '../constant/common';
import User from '../models/user';
import JSONResponse from '../response/JSONResponse';

const jwt = blueBirdPromise.promisifyAll(jsonwebtoken);

const TOKEN_SECRET = process.env['TOKEN_SECRET'] ?? '';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['Authorization'] || req.headers['authorization'] || '';

  if (!token) {
    return JSONResponse.error(res, 'No token provided.', 200);
  }
  jwt.verify(token.toString(), TOKEN_SECRET, async (error: any, decoded: any) => {
    if (error) {
      return JSONResponse.error(res, error.message, 401);
    } else if (!decoded.userId || decoded.userId === '') {
      return JSONResponse.error(res, 'user not found', 401);
    } else {
      const result = await User.findOne({ api_token: token });
      if (result) {
        if (result.status === 0) {
          return JSONResponse.error(res, 'account deactivated', 200);
        } else {
          return next();
        }
      } else {
        return JSONResponse.error(res, 'session expired', 403);
      }
    }
  });
};

const auth_without_login = (req: Request, res: Response, next: NextFunction) => {
  const deviceType = req.headers['devicetype'] ? req.headers['devicetype'] : 'web';
  const deviceToken = req.headers['devicetoken'] ? req.headers['devicetoken'] : '';
  req.body.data = {
    deviceType,
    deviceToken,
  };
  return next();
};

const genrateUserToken = async (data: any) => {
  const options = { expiresIn: settings.expiresIn };

  const jwtToken = jwt.sign(data, TOKEN_SECRET, options);
  return jwtToken;
};

const verifyToken = (token: string): boolean => {
  try {
    jwt.verify(token, TOKEN_SECRET);
    return true; // Token is valid
  } catch (error) {
    return false; // Token is invalid
  }
};

export { genrateUserToken, auth_without_login, authenticate, verifyToken };
