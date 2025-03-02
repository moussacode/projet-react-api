const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createOrder, getMyOrders } = require('../controllers/orderController');



router.route('/')
  .post(createOrder)
  .get(getMyOrders);

module.exports = router;