const Order = require('../models/Order');
const paypal = require('../config/paypalConfig');

async function createOrder(data) {
  const { email, items, billingInfo, shippingInfo, totalPrice, paymentMethod } = data;
  const order = new Order({
    email,
    items,
    billingInfo,
    shippingInfo,
    totalPrice,
    paymentMethod,
    status: 'CREATED',
  });
  await order.save();
  return order;
}

async function createPaypalPayment(order) {
  const create_payment_json = {
    "intent": "sale",
    "payer": { "payment_method": "paypal" },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
      "item_list": { "items": order.items },
      "amount": {
        "currency": "USD",
        "total": order.totalPrice.toFixed(2)
      },
      "description": "Order Payment"
    }]
  };

  return new Promise((resolve, reject) => {
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        return reject(error);
      } else {
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
        resolve({ approvalUrl, payment });
      }
    });
  });
}

async function capturePaypalPayment(paymentId, payerId, totalPrice) {
  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{ "amount": { "currency": "USD", "total": totalPrice.toFixed(2) } }]
  };

  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
      if (error) {
        return reject(error);
      } else {
        resolve(payment);
      }
    });
  });
}

module.exports = {
  createOrder,
  createPaypalPayment,
  capturePaypalPayment,
};
