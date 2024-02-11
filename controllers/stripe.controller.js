require("../services/data.service")();
const stripe = require('stripe')(process.env.STRIPEKEY);
const ups = require("../controllers/ups.controller");

// Create a payment intent then return the client secret
exports.createPaymentIntents = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      msg: "body can not be empty!"
    });
    return;
  }

  try {
    //we create an invocie
    const { items, orderId, shippingAddress } = req.body;
    // console.log('shippingAddress:', shippingAddress)
    let total = await calculateOrderAmount(items, orderId)

    let shippingAddressStr = JSON.stringify(shippingAddress)
    //Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "eur",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_id: orderId,
        shippingAddress: shippingAddressStr
      }
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
      console.log(err);
      res.status(500).send({
        msg:
          err.message || "Some error occurred while finding payment method."
      });
  }
}


// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body
exports.listen = async (req, res) => {
  const event = req.body;
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('paymentIntent:', paymentIntent)
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    case 'charge.succeeded':
      const chargeMethod = event.data.object;
      const { items, order_id, shippingAddress } = chargeMethod.metadata;
      let runups = await ups.create(order_id, JSON.parse(shippingAddress));
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
};