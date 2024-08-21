import { Router, Request, Response } from 'express';
import _ from 'lodash';
import Controller from '../interfaces/controller.interface';
import JSONResponse from '../response/JSONResponse';
import ProductModel from '../models/product';
import ProductRatingModel from '../models/productRating';
import CartModel from '../models/cart';
import { settings } from '../constant/common';
import { paginate, ObjectId } from '../utils/common';

class ProductController implements Controller {
  public router = Router();
  private productModel = ProductModel;
  private productRatingModel = ProductRatingModel;
  private cartModel = CartModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`/latestproducts`, this.latestProducts);
    this.router.post(`/products`, this.products);
    this.router.get(`/productdetail`, this.showProduct);
  }

  private latestProducts = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const data = await this.productModel.find({}, { id: '$_id', _id: 0, name: 1, price: 1, image: 1 }).limit(4);

      return JSONResponse.success(res, data, 'Data retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private products = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { PER_PAGE_RECORDS } = settings;
      const { page = 1 } = req.query;
      let { categories, rating } = req.body;
      const { price } = req.body;
      let sort = {};
      let match = { status: 1 };
      let metaDataAggregation = [];

      //dynamic sorting for price
      if (!_.isEmpty(price)) {
        const priceOrder = _.lowerCase(price) == 'asc' ? 1 : -1;
        sort = { price: priceOrder };
      }

      //dynamic sorting for price and created:-1
      sort = { ...sort, createdAt: -1 };

      if (!_.isEmpty(categories) && _.isArray(categories)) {
        categories = _.map(categories, (val) => ObjectId(val));
        const categoryFilter = { category: { $in: categories } };

        match = { ...match, ...categoryFilter };
      }

      const { offset, limit } = paginate(+page, PER_PAGE_RECORDS);

      if (!_.isEmpty(rating) && _.isArray(rating)) {
        metaDataAggregation = [];

        rating = _.map(rating, (val) => parseInt(val));

        const min = _.min(rating);
        const max = _.max(rating);

        const ratingMatch =
          rating.length > 1
            ? {
                $and: [{ avgRating: { $gte: min } }, { avgRating: { $lte: max } }],
              }
            : { avgRating: { $in: rating } };

        metaDataAggregation.push(
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
              total: { $sum: 1 },
              name: { $first: '$name' },
              price: { $first: '$price' },
              image: { $first: '$image' },
              qty: { $first: '$qty' },
              reviewCount: { $sum: '$ratings.rating' },
              avgRating: { $avg: '$ratings' },
            },
          },
          {
            $match: ratingMatch,
          },
          { $skip: offset },
          { $limit: limit },
          {
            $project: {
              id: '$_id',
              _id: 0,
              name: 1,
              price: 1,
              image: 1,
              qty: 1,
              total: 1,
              avgRating: { $round: ['$avgRating', 1] },
              reviewCount: 1,
            },
          },
        );
      } else {
        metaDataAggregation = [];

        metaDataAggregation.push(
          {
            $lookup: {
              from: 'product_ratings',
              localField: '_id',
              foreignField: 'product_id',
              as: 'ratings',
            },
          },

          { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },

          { $skip: offset },
          { $limit: limit },
          {
            $project: {
              id: '$_id',
              _id: 0,
              name: 1,
              price: 1,
              image: 1,
              qty: 1,
              reviewCount: { $sum: '$ratings.rating' },
              avgRating: {
                $cond: {
                  if: {
                    $eq: [{ $ifNull: ['$ratings.rating', ''] }, ''],
                  },
                  then: 0, // If "field" is null or empty string, return 0
                  else: { $round: [{ $avg: '$ratings.rating' }, 1] }, // Otherwise, return the value of with avg with round
                },
              },
            },
          },
        );
      }

      const rows = await this.productModel.aggregate([
        {
          $match: match,
        },
        {
          $sort: sort,
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: metaDataAggregation,
          },
        },
      ]);
      let total;
      if (!_.isEmpty(rating) && !_.isEmpty(rows[0].data)) total = rows[0].data[0].total;
      else if (!_.isEmpty(rating) && _.isEmpty(rows[0].data)) total = 0;
      else total = rows[0].metadata[0].total;

      const data = {
        docs: rows[0].data,
        page: +page || 1,
        limit: limit,
        total: total,
        lastPage: Math.ceil(total / limit),
      };

      return JSONResponse.success(res, data, 'Data retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private showProduct = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { product_id, user_id } = req.query;

      const product = await this.productModel
        .findById(product_id)
        .select('_id name image price qty category information');
      const data = [];

      if (!product) return JSONResponse.error(res, 'Product not found', 200);

      const productRating = await this.productRatingModel.aggregate([
        {
          $match: { product_id: ObjectId(_.toString(product._id)) },
        },
        {
          $facet: {
            reviewCount: [{ $count: 'reviewCount' }],

            avgRating: [
              {
                $group: {
                  _id: '$product_id',
                  avgRating: { $avg: '$rating' },
                },
              },
              {
                $project: {
                  _id: 0,
                  avgRating: { $round: ['$avgRating', 1] },
                  reviewCount: 1,
                },
              },
            ],

            comments: [
              {
                $lookup: {
                  from: 'users',
                  localField: 'user_id',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              {
                $unwind: '$user',
              },
              {
                $project: {
                  _id: 0,
                  name: '$user.name',
                  image: '$user.image',
                  comment: 1,
                  rating: 1,
                  created_at: '$createdAt',
                },
              },
            ],
          },
        },
      ]);

      const relatedProducts = await this.productModel.aggregate([
        {
          $match: {
            status: { $eq: 1 },
            category: { $eq: ObjectId(product.category) },
            _id: { $ne: ObjectId(product.id) },
          },
        },
        {
          $sample: { size: 4 },
        },
        {
          $project: {
            id: '$_id',
            _id: 0,
            name: 1,
            qty: 1,
            price: 1,
            image: 1,
            category: 1,
          },
        },
      ]);

      let isCart = false;

      const checkCart = await this.cartModel.findOne(
        {
          $and: [
            { product_id: { $eq: ObjectId(_.toString(product_id)) } },
            { user_id: { $eq: ObjectId(_.toString(user_id)) } },
          ],
        },
        { user_id: 1 },
      );
      isCart = !checkCart === false;

      data.push({
        extra: {
          top_information: product.information.substring(0, 250),
          reviewsCount: !_.isEmpty(productRating[0].reviewCount) ? productRating[0].reviewCount[0].reviewCount : 0,
          avg_rating: !_.isEmpty(productRating[0].avgRating) ? productRating[0].avgRating[0].avgRating : 0,
          isCart: isCart,
        },
        product: product,
        reviews: !_.isEmpty(productRating[0].comments) ? productRating[0].comments : [],
        relatedProducts: relatedProducts,
      });

      return JSONResponse.success(res, data[0], 'Data retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default ProductController;
