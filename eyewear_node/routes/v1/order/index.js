const { Router } = require("express");
const { authenticate } = require("../../../middlewares/auth");
const {
  deliveryChargeValidation,
  checkOrderValidation,
  applyCouponValidation,
  placeOrderValidation,
  ordersValidation,
} = require("../../../validator/order");
const {
  getDeliveryCharge,
  getCheckoutInfo,
  checkOrder,
  applyCoupon,
  placeOrder,
  razorPayCallback,
  orders,
} = require("../../../controllers/order/order.controller");
const router = Router();

router.post(
  "/deliverycharge",
  authenticate,
  deliveryChargeValidation,
  getDeliveryCharge
);
router.get("/getcheckoutinfo", authenticate, getCheckoutInfo);
router.post("/checkorder", authenticate, checkOrderValidation, checkOrder);
router.post("/applycoupon", authenticate, applyCouponValidation, applyCoupon);
router.post("/placeorder", authenticate, placeOrderValidation, placeOrder);
router.get("/razorpaycallback", razorPayCallback);
router.get("/orders", authenticate, ordersValidation, orders);

module.exports = router;
