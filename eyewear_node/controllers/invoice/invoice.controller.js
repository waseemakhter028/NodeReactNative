const fs = require("fs");
let pdf = require("html-pdf");
const path = require("path");
const { renderFile } = require("ejs");
const ProductOrder = require("../../models/productOrder");
const OrderCoupon = require("../../models/orderCoupon");
const Order = require("../../models/order");
const _ = require("lodash");
const moment = require("moment");

function generatePdf(html, fileName, options) {
  return new Promise(function (resolve, reject) {
    const error = true;

    pdf
      .create(html, options)
      .toFile(appRoot + "/public/docs/" + fileName, function (err, res) {
        if (err) reject(err);
        else resolve("Pdf Created Successfully");
      });
  });
}

const index = async (req, res) => {
  const { order_id } = req.query;

  const timezone = req.body.timezone || "Asia/Kolkata";

  if (_.isEmpty(order_id))
    return helper.sendError({}, res, req.t("invalid_order"), 200);

  const orderInfo = await Order.findById(order_id).populate({
    path: "transaction_id",
  });

  if (!orderInfo) return helper.sendError({}, res, req.t("invalid_order"), 200);

  const products = await ProductOrder.find({
    order_id: helper.ObjectId(order_id),
  }).populate({ path: "product_id", select: "name" });

  const CouponOrder = await OrderCoupon.findOne({
    order_id: helper.ObjectId(order_id),
  }).populate({
    path: "user_coupon_id",
    select: "coupon_amount",
    populate: {
      path: "coupon_id",
      select: "title",
    },
  });

  let coupon = !CouponOrder ? null : CouponOrder;

  let payment_method = null;

  if (orderInfo.transaction_id.payment_method === "razorpay") {
    if (orderInfo.transaction_detail.method === "card") {
      payment_method = "Card***** " + orderInfo.transaction_detail.card.last4;
    } else {
      payment_method = orderInfo.transaction_detail.method;
    }
  } else {
    payment_method = "Coupon";
  }

  let fileName = `${orderInfo.order_id}_orderinvoice.pdf`;

  let image_url = `${process.env.APP_URL}/image/weblogo.png`;

  let order_time = moment.utc(orderInfo.createdAt).tz(timezone);

  order_time = moment(order_time).format("DD-MMM-YYYY h:mm A");

  let web_url = process.env.WEB_URL;

  let html = await renderFile(appRoot + "/views/mail/orderpdf.ejs", {
    products: products,
    payment_method: payment_method,
    orderInfo: orderInfo,
    order_time: order_time,
    coupon: coupon,
    image_url: image_url,
    web_url: web_url,
  });

  let options = { format: "A4" };

  await generatePdf(html, fileName, options);

  const directory = appRoot + "/public/docs";

  const file = `${appRoot}/public/docs/${fileName}`;
  res.download(file, fileName);

  //unlink file after successful download
  setTimeout(() => {
    fs.unlink(path.join(directory, fileName), (err) => {
      if (err) throw err;
    });
  }, 3000);
};

const orderInvoice = async (req, res) => {
  const { order_id } = req.query;

  const timezone = req.headers["timezone"] || "Asia/Calcutta";

  if (_.isEmpty(order_id))
    return helper.sendError({}, res, req.t("invalid_order"), 200);

  try {
    const orderInfo = await Order.findById(order_id).populate({
      path: "transaction_id",
      // select: "payment_method",
    });

    if (!orderInfo)
      return helper.sendError({}, res, req.t("invalid_order"), 200);

    const products = await ProductOrder.find({
      order_id: helper.ObjectId(order_id),
    }).populate({ path: "product_id", select: "name image" });

    const CouponOrder = await OrderCoupon.findOne({
      order_id: helper.ObjectId(order_id),
    }).populate({
      path: "user_coupon_id",
      select: "coupon_amount",
      populate: {
        path: "coupon_id",
        select: "title",
      },
    });

    let coupon = !CouponOrder ? null : CouponOrder;

    let payment_method = null;

    if (orderInfo.transaction_id.payment_method === "razorpay") {
      if (orderInfo.transaction_detail.method === "card") {
        payment_method = "Card***** " + orderInfo.transaction_detail.card.last4;
      } else {
        payment_method = orderInfo.transaction_detail.method;
      }
    } else {
      payment_method = "Coupon";
    }

    const fileName = `${orderInfo.order_id}_orderinvoice.pdf`;

    let order_time = moment.utc(orderInfo.createdAt).tz(timezone);

    order_time = moment(order_time).format("DD-MMM-YYYY h:mm A");

    const data = {
      products: products,
      payment_method: payment_method,
      orderInfo: orderInfo,
      order_time: order_time,
      coupon: coupon,
      fileName: fileName,
    };
    return helper.sendSuccess(data, res, req.t("data_retrived"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

module.exports = {
  index,
  orderInvoice,
};
