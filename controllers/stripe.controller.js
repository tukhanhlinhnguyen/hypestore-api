
const stripe = require('stripe')(process.env.STRIPEKEY);


const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

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

    // Create a PaymentIntent with the order amount and currency
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

    // if(invoice){
    //   //we add a new item line for commission
    //   const lineInvoice = await stripe.invoiceItems.create({
    //     customer: stripeCusId,
    //     amount: 700,
    //     currency: 'usd',
    //     description: 'commission order '+orderId,
    //     invoice: invoice.id
    //   })
    //   const payInvoice = await stripe.invoices.pay(
    //     invoice.id
    //   );
    //   if(payInvoice){
    //     //write on database
    //     Order.update({
    //       stripeInvoiceId : invoice.id,
    //       isPaid : true
    //     }, {
    //       where: { id: orderId },
    //       returning: true,
    //     })
    //     .then(result => {
    //       res.send({
    //         msg : 'payment succesfuly invoice '+ invoice.id,
    //         ok : "ok"
    //       });
    //     })
    //   }else{
    //     res.status(500).send({
    //       msg : 'error when trying to pay payment intent '+invoice.id,
    //     });
    //   }
    // }else{
    //   res.status(500).send({
    //     msg : 'error creating payment intent',
    //   });
    // }
  } catch (err) {
      console.log(err);
      res.status(500).send({
        msg:
          err.message || "Some error occurred while finding payment method."
      });
  }
}