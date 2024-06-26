const _ = require("lodash");
const Cart = require("../../models/cart");
const Address = require("../../models/address");
const UserCoupon = require("../../models/userCoupon");
const Coupon = require("../../models/coupon");
const Order = require("../../models/order");
const OrderCoupon = require("../../models/orderCoupon");
const Transaction = require("../../models/transaction");
const ProductOrder = require("../../models/productOrder");
const Product = require("../../models/product");
const Subscriber = require("../../models/subscriber");
const moment = require("moment");
const striptags = require("striptags");
const Razorpay = require("razorpay");
const helper = require("../../heplers/helper");

const getDeliveryCharge = (req, res) => {
  try {
    const { total_amount } = req.body;
    const delivery_charge = helper.deliveryFee(total_amount);
    return helper.sendSuccess(
      delivery_charge,
      res,
      req.t("data_retrived"),
      200
    );
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const getCheckoutInfo = async (req, res) => {
  try {
    const { user_id } = req.query;
    const data = {};
    if (_.isEmpty(user_id) || !helper.ObjectId.isValid(user_id)) {
      return helper.sendError({}, res, req.t("user_not_found"), 200);
    }

    data["coupon"] = [];
    data["cart"] = await Cart.aggregate([
      {
        $match: { user_id: helper.ObjectId(user_id) },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          id: "$_id",
          _id: 0,
          image: "$product.image",
          name: "$product.name",
          price: "$product.price",
          user_id: 1,
          product_id: 1,
          quantity: 1,
        },
      },
    ]);

    let sumSubTotal = 0;
    if (data["cart"].length > 0) {
      sumSubTotal = data["cart"].reduce(function (accumulator, item) {
        return accumulator + item.quantity * item.price;
      }, 0);
    }
    data["delivery_charge"] = parseInt(helper.deliveryFee(sumSubTotal));

    data["address"] = await Address.find({
      user_id: helper.ObjectId(user_id),
    }).sort({ createdAt: -1 });

    let coupons = await UserCoupon.find({
      user_id: helper.ObjectId(user_id),
      used: 0,
    }).populate({
      path: "coupon_id",
      select: "_id title code description validity",
    });

    if (coupons.length > 0) {
      for (let key = 0; key < coupons.length; key++) {
        let info = coupons[key].coupon_id;
        let date = "Lifetime";
        if (info.validity != "" && info.validity != null) {
          let curDate = moment
            .utc()
            .tz(req.headers["timezone"])
            .format("YYYY-MM-DD");
          let couponDate = moment
            .utc(info.validity)
            .tz(req.headers["timezone"])
            .format("YYYY-MM-DD");
          date =
            couponDate > curDate
              ? moment
                  .utc(info.validity)
                  .tz(req.headers["timezone"])
                  .format("DD-MMM-YYYY")
              : "Expired";
        }

        data["coupon"].push({
          title: info.title,
          code: info.code,
          description: info.description,
          amount: coupons[key].coupon_amount,
          validity: date,
        });
      }
    }

    return helper.sendSuccess(data, res, req.t("data_retrived"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const checkOrder = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (_.isEmpty(user_id) || !helper.ObjectId.isValid(user_id)) {
      return helper.sendError({}, res, req.t("user_not_found"), 200);
    }

    const cart = await Cart.find(
      { user_id: helper.ObjectId(user_id) },
      { id: 1, user_id: 1, quantity: 1 }
    )
      .populate({ path: "product_id", select: "_id qty name price status" })
      .sort({ createdAt: -1 });

    if (cart.length < 1)
      return helper.sendError({}, res, req.t("cart_no_items"), 200);

    for (let row of cart) {
      if (row.product_id.status !== 1)
        return helper.sendError(
          {},
          res,
          row.product_id.name + "" + req.t("order_product_status"),
          200
        );
      else if (row.quantity > 20)
        return helper.sendError(
          {},
          res,
          row.product_id.name + "" + req.t("order_qty_limit"),
          200
        );
      else if (row.product_id.qty === 0)
        return helper.sendError(
          {},
          res,
          row.product_id.name + "" + req.t("order_out_of_stock"),
          200
        );
      else if (row.quantity > row.product_id.qty)
        return helper.sendError(
          {},
          res,
          row.product_id.name +
            "" +
            req.t("order_available_qty") +
            "" +
            row.product_id.qty,
          200
        );
    }

    return helper.sendSuccess({}, res, req.t("order_checkout"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const checkCoupon = async (req, res) => {
  const { user_id, coupon_code } = req.body;

  const couponInfo = await Coupon.findOne(
    { code: coupon_code },
    { _id: 1, validity: 1, status: 1, code: 1 }
  );

  if (!couponInfo) return req.t("coupon_invalid");

  const userCouponInfo = UserCoupon.findOne({
    user_id: helper.ObjectId(user_id),
    coupon_id: helper.ObjectId(couponInfo._id),
  });

  if (couponInfo.status != 1) {
    return req.t("coupon_deactivated");
  } else if (!userCouponInfo) {
    return req.t("coupon_invalid");
  } else if (couponInfo.validity != "" && couponInfo.validity != null) {
    let curDate = moment.utc().tz(req.headers["timezone"]).format("YYYY-MM-DD");
    let couponDate = moment
      .utc(couponInfo.validity)
      .tz(req.headers["timezone"])
      .format("YYYY-MM-DD");
    if (couponDate < curDate) return req.t("coupon_expired");
  }

  return 1;
};

const applyCoupon = async (req, res) => {
  const check = await checkCoupon(req, res);

  if (check == 1)
    return helper.sendSuccess({}, res, req.t("coupon_applied"), 200);
  else return helper.sendError({}, res, check, 200);
};

const insertCouponLog = (data) => {
  const { user_id, id, order_id } = data;

  UserCoupon.findByIdAndUpdate(
    id,
    {
      used: 1,
    },
    { new: true }
  )
    .then((couponUsed) => {})
    .catch((err) => {});

  OrderCoupon.create({
    user_id: user_id,
    user_coupon_id: id,
    order_id: order_id,
  })
    .then((coupon) => {})
    .catch((err) => {});
};

const insertTransaction = async (data) => {
  const { user_id, total_amount, payment_method, status } = data;

  const save = await Transaction.create({
    user_id: user_id,
    total_amount: total_amount,
    payment_method: payment_method,
    status: status,
  });

  return save._id;
};

const insertOrder = async (data) => {
  const {
    user_id,
    transaction_id,
    transaction_detail,
    payment_method,
    notes,
    address_id,
    delivery_charge,
  } = data;

  const addressInfo = await Address.findById(address_id);

  const orderInfo = await Order.create({
    order_id: "EY" + helper.rand(12345678, 99999999),
    user_id: user_id,
    transaction_id: transaction_id,
    transaction_detail: transaction_detail,
    address_detail: addressInfo,
    notes: striptags(notes),
    delivery_charge: delivery_charge,
    status: 1,
  });

  const cart = await Cart.find(
    { user_id: helper.ObjectId(user_id) },
    { id: 1, user_id: 1, quantity: 1, size: 1, color: 1 }
  )
    .populate({ path: "product_id", select: "_id qty name price status" })
    .sort({ createdAt: -1 });

  if (cart.length > 0) {
    for (let row of cart) {
      let qty = parseInt(row.quantity);
      await ProductOrder.create({
        order_id: orderInfo._id,
        product_id: row.product_id._id,
        price: row.product_id.price,
        quantity: qty,
        size: row.size,
        color: row.color,
      });

      await Product.findByIdAndUpdate(row.product_id._id, {
        $inc: { qty: -qty },
      });
    } //for loop close

    Cart.deleteMany({ user_id: helper.ObjectId(user_id) })
      .then((cartInfo) => {})
      .catch((err) => {});
  }
  return orderInfo;
};

const couponCheckout = async (req, res) => {
  try {
    const userCart = await Cart.find(
      { user_id: helper.ObjectId(req.body.user_id) },
      { id: 1, user_id: 1, quantity: 1 }
    )
      .populate({ path: "product_id", select: "_id qty name price status" })
      .sort({ createdAt: -1 });

    let subTotal = 0;

    userCart.map(
      (row, inx) => (subTotal += +row.product_id.price * +row.quantity)
    );
    let deliveryCharge = parseFloat(helper.deliveryFee(subTotal));
    let total = subTotal + deliveryCharge;
    total = parseFloat(total).toFixed(2);
    let couponAmount = 0;
    let userCouponInfo = null;
    let couponInfo = null;

    if (!_.isEmpty(req.body.coupon_code)) {
      const check = await checkCoupon(req, res);

      if (check == 1) {
        couponInfo = await Coupon.findOne(
          { code: req.body.coupon_code },
          { _id: 1, validity: 1, status: 1, code: 1 }
        );

        userCouponInfo = await UserCoupon.findOne({
          user_id: helper.ObjectId(req.body.user_id),
          coupon_id: helper.ObjectId(couponInfo._id),
        });
      } else {
        return helper.sendError({}, res, check, 200);
      }
    }

    const transactionData = {
      user_id: req.body.user_id,
      total_amount: total,
      payment_method: req.body.payment_method,
      status: "paid",
    };

    const transaction_id = await insertTransaction(transactionData);

    const orderData = {
      user_id: req.body.user_id,
      transaction_id: transaction_id,
      transaction_detail: {
        payment_type: "coupon",
      },
      payment_method: req.body.payment_method,
      notes: req.body.notes,
      address_id: req.body.address_id,
      delivery_charge: deliveryCharge,
    };

    const order = await insertOrder(orderData);

    const couponData = {
      user_id: req.body.user_id,
      id: userCouponInfo._id,
      order_id: order._id,
    };
    insertCouponLog(couponData);

    return order;
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const razorpayCheckout = async (req, res) => {
  try {
    const userCart = await Cart.find(
      { user_id: helper.ObjectId(req.body.user_id) },
      { id: 1, user_id: 1, quantity: 1 }
    )
      .populate({ path: "product_id", select: "_id qty name price status" })
      .sort({ createdAt: -1 });

    let subTotal = 0;

    userCart.map(
      (row, inx) => (subTotal += +row.product_id.price * +row.quantity)
    );
    let deliveryCharge = parseFloat(helper.deliveryFee(subTotal));
    let total = subTotal + deliveryCharge;

    let couponAmount = 0;
    let userCouponInfo = null;
    let couponInfo = null;

    if (!_.isEmpty(req.body.coupon_code)) {
      const check = await checkCoupon(req, res);

      if (check == 1) {
        couponInfo = await Coupon.findOne(
          { code: req.body.coupon_code },
          { _id: 1, validity: 1, status: 1, code: 1 }
        );

        userCouponInfo = await UserCoupon.findOne({
          user_id: helper.ObjectId(req.body.user_id),
          coupon_id: helper.ObjectId(couponInfo._id),
        });
        total = total - userCouponInfo.coupon_amount;
      } else {
        return helper.sendError({}, res, check, 200);
      }
    }

    total = parseFloat(total).toFixed(2);

    if (total < 50) {
      return helper.sendError({}, res, req.t("minimum_order_value"), 200);
    }

    const addressInfo = await Address.findById(req.body.address_id);
    let description = `Order placed with user id ${req.body.user_id} Address: ${addressInfo.street}, ${addressInfo.address}, ${addressInfo.city}, ${addressInfo.state}, ${addressInfo.zipcode}`;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY_ID, // Replace with your key ID
      key_secret: process.env.RAZORPAY_API_KEY_SECRET, // Replace with your key secret
    });

    const charge = await razorpay.payments.fetch(req.body.paymentId);

    if (charge.status) {
      if (charge.status !== "captured") {
        await razorpay.payments.capture(charge.id, charge.amount);
      }
      const transactionData = {
        user_id: req.body.user_id,
        total_amount: total,
        payment_method: req.body.payment_method,
        status: "paid",
      };

      const transaction_id = await insertTransaction(transactionData);

      const orderData = {
        user_id: req.body.user_id,
        transaction_id: transaction_id,
        transaction_detail: charge,
        payment_method: req.body.payment_method,
        notes: req.body.notes,
        address_id: req.body.address_id,
        delivery_charge: deliveryCharge,
      };

      const order = await insertOrder(orderData);

      if (!_.isEmpty(req.body.coupon_code)) {
        const couponData = {
          user_id: req.body.user_id,
          id: userCouponInfo._id,
          order_id: order._id,
        };
        insertCouponLog(couponData);
      }

      return order;
    }
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const placeOrder = async (req, res) => {
  const { user_id } = req.body;

  try {
    const cart = await Cart.find(
      { user_id: helper.ObjectId(user_id) },
      { id: 1, user_id: 1, quantity: 1 }
    )
      .populate({ path: "product_id", select: "_id qty name price status" })
      .sort({ createdAt: -1 });

    if (cart.length < 1)
      return helper.sendError({}, res, req.t("cart_no_items"), 200);

    for (let row of cart) {
      if (row.product_id.status !== 1)
        return helper.sendError(
          {},
          res,
          row.product_id.name + "" + req.t("order_product_status"),
          200
        );
      else if (row.quantity > 20)
        return helper.sendError(
          {},
          res,
          row.product_id.name + "" + req.t("order_qty_limit"),
          200
        );
      else if (row.product_id.qty === 0)
        return helper.sendError(
          {},
          res,
          row.product_id.name + "" + req.t("order_out_of_stock"),
          200
        );
      else if (row.quantity > row.product_id.qty)
        return helper.sendError(
          {},
          res,
          row.product_id.name +
            "" +
            req.t("order_available_qty") +
            "" +
            row.product_id.qty,
          200
        );
    }

    let order = null;
    if (req.body.payment_method == "razorpay")
      order = await razorpayCheckout(req, res);
    else if (req.body.payment_method == "coupon")
      order = await couponCheckout(req, res);

    let status = helper.orderStatus(order.status);
    status = req.t(status);

    helper.sendNotification(
      user_id,
      "Order Placed",
      `Your order ${order.order_id} is now ${status}`
    );

    return helper.sendSuccess({}, res, req.t("order_save"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const razorPayCallback = async (req, res) => {
  const { email } = req.query;
  try {
    const save = await Subscriber.create({ email });
    /* istanbul ignore next */
    if (!save)
      return helper.sendException(res, req.t("something_is_wrong"), 200);

    return helper.sendSuccess({}, res, req.t("order_save"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const orders = async (req, res) => {
  try {
    const { page = 1, user_id, status } = req.query;
    const { offset, limit } = helper.paginate(page, 3);

    let match =
      status == 4
        ? // when order status=delivered
          {
            status: { $eq: 4 },
            user_id: { $eq: helper.ObjectId(user_id) },
          }
        : // when order status!=delivered
          {
            status: { $ne: 4 },
            user_id: { $eq: helper.ObjectId(user_id) },
          };

    const rows = await Order.aggregate([
      {
        $match: match,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "transaction_id",
          foreignField: "_id",
          as: "transaction",
        },
      },
      { $unwind: { path: "$transaction", preserveNullAndEmptyArrays: true } },

      { $addFields: { total: "$transaction.total_amount" } },

      {
        $lookup: {
          from: "product_orders",
          localField: "_id",
          foreignField: "order_id",
          as: "productOrders",
        },
      },
      { $unwind: { path: "$productOrders", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "products",
          localField: "productOrders.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          id: "$_id",
          _id: 0,
          order_id: 1,
          rated: 1,
          notes: 1,
          status: 1,
          transaction_detail: 1,
          address_detail: 1,
          delivery_charge: 1,
          total: 1,
          "productOrders.price": 1,
          "productOrders.quantity": 1,
          "productOrders.size": 1,
          "productOrders.color": 1,
          "product.name": 1,
          "product.image": 1,
        },
      },

      {
        $facet: {
          data: [{ $count: "total" }],
          metaData: [
            { $skip: offset },
            { $limit: limit },

            {
              $project: {
                id: 1,
                order_id: 1,
                rated: 1,
                notes: 1,
                status: 1,
                total: 1,
                transaction_detail: 1,
                address_detail: 1,
                delivery_charge: 1,
                "productOrders.price": 1,
                "productOrders.quantity": 1,
                "productOrders.size": 1,
                "productOrders.color": 1,
                "product.name": 1,
                "product.image": 1,
              },
            },
          ],
        },
      },
    ]);

    let total;
    let result = [];
    if (rows[0].metaData.length > 0) {
      if (!_.isEmpty(rows[0].data)) total = rows[0].data[0].total;

      // let info = rows[0].metaData;
      // for (let key in info) {
      //   result[key] = info[key];
      //   result[key]["productOrders"] = await ProductOrder.find({
      //     order_id: helper.ObjectId("66573a5d7d0537d6c59af102"),
      //   });
      // }
    } else {
      total = 0;
    }

    const data = {
      data: rows[0].metaData,
      pagedata: {
        current_page: +page || 1,
        per_page: limit,
        total: total,
        last_page: Math.ceil(total / limit),
      },
    };

    return helper.sendSuccess(data, res, req.t("data_retrived"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

module.exports = {
  getDeliveryCharge,
  getCheckoutInfo,
  checkOrder,
  applyCoupon,
  placeOrder,
  razorPayCallback,
  orders,
};
