const orderService = require('../services/orderService');
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error });
  }
};

exports.createPaypalPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { approvalUrl } = await orderService.createPaypalPayment(order);
    res.status(200).json({ approvalUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create PayPal payment', error });
  }
};

exports.capturePaypalPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentId, payerId, totalPrice } = req.body;
    const payment = await orderService.capturePaypalPayment(paymentId, payerId, totalPrice);

    await Order.findByIdAndUpdate(orderId, { status: 'PAID' });

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to capture PayPal payment', error });
  }
};
