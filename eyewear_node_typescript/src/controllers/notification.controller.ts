import { Router, Request, Response } from 'express';
import _ from 'lodash';
import Controller from '../interfaces/controller.interface';
import { authenticate } from '../middleware/auth';
import JSONResponse from '../response/JSONResponse';
import NotificationModel from '../models/notification';
import UserModel from '../models/user';
import { paginate, getAuthorization, ObjectId } from '../utils/common';

class NotificationController implements Controller {
  public router = Router();
  private notificationModel = NotificationModel;
  private userModel = UserModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`/notifications`, authenticate, this.index);
    this.router.get(`/unreadcount`, authenticate, this.unreadCount);
  }

  private index = async (req: Request, res: Response): Promise<Response | void> => {
    const token = getAuthorization(req);

    const { page = 1 } = req.query;

    try {
      const user = await this.userModel.findOne({ api_token: token });

      const { offset, limit } = paginate(_.toString(page), 3);

      const rows = await this.notificationModel.aggregate([
        {
          $match: { user_id: { $eq: ObjectId(_.toString(user?.id)) } },
        },
        {
          $sort: { createdAt: -1 },
        },

        {
          $project: {
            id: '$_id',
            _id: 0,
            user_id: 1,
            title: 1,
            body: 1,
            read_at: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
          },
        },

        {
          $facet: {
            data: [{ $count: 'total' }],
            metaData: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);

      let total;
      if (rows[0].metaData.length > 0) {
        if (!_.isEmpty(rows[0].data)) total = rows[0].data[0].total;
      } else {
        total = 0;
      }

      const currentPage = +page || 1;
      const lastPage = Math.ceil(total / 3);

      await this.notificationModel.updateMany({ user_id: ObjectId(user?.id) }, { read_at: Date.now() });

      const data = {
        data: rows[0].metaData,
        itemCount: total,
        limit: limit,
        last_page: lastPage,
        currentPage: currentPage,
        slNo: currentPage,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < lastPage,
        prev: currentPage > 1 ? currentPage - 1 : 1,
        next: currentPage < lastPage ? currentPage + 1 : lastPage,
      };

      return JSONResponse.success(res, data, 'Data Retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private unreadCount = async (req: Request, res: Response): Promise<Response | void> => {
    const token = getAuthorization(req);
    try {
      const user = await this.userModel.findOne({ api_token: token });
      let unread = await this.notificationModel.aggregate([
        {
          $match: { user_id: ObjectId(user?.id), read_at: null },
        },
        { $count: 'count' },
      ]);

      unread = !_.isEmpty(unread) ? unread[0].count : 0;

      return JSONResponse.success(res, unread, 'Data Retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default NotificationController;
