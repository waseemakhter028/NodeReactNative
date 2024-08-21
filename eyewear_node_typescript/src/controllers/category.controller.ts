import { Router, Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';
import JSONResponse from '../response/JSONResponse';
import ProductModel from '../models/product';

class CategoryController implements Controller {
  public path = '/category';
  public router = Router();
  private productModel = ProductModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}`, this.index);
  }

  private index = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const categories = await this.productModel.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'cat',
          },
        },
        // use unwind to array to object conversion becasue mongodb alwayas return array
        {
          $unwind: '$cat',
        },

        {
          $project: {
            _id: 0,
            categoryId: '$cat._id',
            name: '$cat.name',
          },
        },

        {
          $group: {
            _id: '$categoryId',
            categoryId: { $first: '$categoryId' },
            name: { $first: '$name' },
          },
        },

        {
          $project: {
            _id: 0,
            name: 1,
            id: '$categoryId',
          },
        },
        {
          $sort: { name: 1 },
        },
      ]);

      return JSONResponse.success(res, categories, 'Category Fetched Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default CategoryController;
