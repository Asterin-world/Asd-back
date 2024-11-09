const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Create a PayPal payment for the order
router.post('/:orderId/paypal', orderController.createPaypalPayment);

// Capture the PayPal payment
router.post('/:orderId/capture', orderController.capturePaypalPayment);

module.exports = router;
