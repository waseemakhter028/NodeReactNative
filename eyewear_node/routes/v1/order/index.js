const { Router } = require('express')
const {deliveryChargeValidation, checkOrderValidation, applyCouponValidation, placeOrderValidation, ordersValidation} = require('../../../validator/order')
const { getDeliveryCharge,getCheckoutInfo, checkOrder, applyCoupon, placeOrder, orders} = require('../../../controllers/order/order.controller')
const router = Router()

router.post('/deliverycharge',deliveryChargeValidation,getDeliveryCharge)
router.get('/getcheckoutinfo',getCheckoutInfo)
router.post('/checkorder', checkOrderValidation, checkOrder)
router.post('/applycoupon', applyCouponValidation, applyCoupon)
router.post('/placeorder', placeOrderValidation, placeOrder)
router.get('/orders', ordersValidation, orders)


module.exports = router;
