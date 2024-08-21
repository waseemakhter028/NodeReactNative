import { Router, Request, Response } from 'express';
import _ from 'lodash';
import Controller from '../interfaces/controller.interface';
import JSONResponse from '../response/JSONResponse';
import ProductModel from '../models/product';
import { ObjectId } from '../utils/common';

class HomeController implements Controller {
  public router = Router();
  private productModel = ProductModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`/homeproducts`, this.getHomeProducts);
    this.router.get(`/topratedproducts`, this.topRatedProducts);
  }

  private getHomeProducts = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const category = _.toString(req.query.category);
      if (_.isEmpty(category)) {
        const rows = await this.productModel
          .find({}, { id: '$_id', name: 1, price: 1, image: 1 })
          .limit(4)
          .sort({ createdAt: -1 });

        return JSONResponse.success(res, rows, 'Data Retrived Successfully!');
      } else {
        const rows = await this.productModel
          .find({ category: ObjectId(category) }, { id: '$_id', name: 1, price: 1, image: 1 })
          .limit(4)
          .sort({ createdAt: -1 });

        return JSONResponse.success(res, rows, 'Data Retrived Successfully!');
      }
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private topRatedProducts = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const rows = await this.productModel.aggregate([
        {
          $match: { status: 1 },
        },
        {
          $lookup: {
            from: 'product_ratings',
            localField: '_id',
            foreignField: 'product_id',
            as: 'ratings',
          },
        },
        { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },

        {
          $project: {
            id: '$_id',
            _id: 1,
            name: 1,
            price: 1,
            image: 1,
            qty: 1,
            ratings: { $ifNull: ['$ratings.rating', 0] },
          },
        },

        {
          $group: {
            _id: '$id',
            avgRating: { $avg: '$ratings' },
            total: { $sum: 1 },
            name: { $first: '$name' },
            price: { $first: '$price' },
            image: { $first: '$image' },
            qty: { $first: '$qty' },
          },
        },

        { $match: { avgRating: { $gte: 0 } } },

        { $sort: { avgRating: -1 } },

        { $limit: 4 },

        { $project: { id: '$_id', _id: 0, name: 1, price: 1, image: 1, qty: 1 } },
      ]);

      return JSONResponse.success(res, rows, 'Data Retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default HomeController;
