require("../services/data.service")();
const stripe = require('stripe')(process.env.STRIPEKEY);

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
    const { items } = req.body;
    console.log(calculateOrderAmount(items));
    //Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "eur",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
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