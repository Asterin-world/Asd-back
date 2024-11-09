const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', // Switch to 'live' when going to production
  'client_id': process.env.PAYPAL_CLIENT_ID, // Use environment variables for security
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

module.exports = paypal;
