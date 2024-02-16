require("../services/data.service")();
require("../services/order.service")();
let paypal = require('paypal-rest-sdk');
const ups = require("../controllers/ups.controller");


// Create a payment intent then return the client secret
exports.createPaymentIntents = async (req, res) => {
    console.log("HEHEHEHEHEEHE")

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
    let total = await calculateOrderAmount(items, orderId);
    let totalPAYPAL = total.toString()
    totalPAYPAL = totalPAYPAL.slice(0, totalPAYPAL.length-2) +'.'+totalPAYPAL.slice(totalPAYPAL.length - 2, totalPAYPAL.length)
    console.log('totalPAYPAL:', totalPAYPAL)   
    let shippingAddressStr = JSON.stringify(shippingAddress)
    //Create a PaymentIntent with the order amount and currency

    console.log('items:', items)

    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': process.env.PAYPALCLIENTID,
        'client_secret': process.env.PAYPALSECRET
    });

    let create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": process.env.MAINURL+"/shop/checkout/success?redirect_status=succeeded",
            "cancel_url": process.env.MAINURL+"/shop/payment"
        },
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": totalPAYPAL
            },
            "description": orderId
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            for (let i = 0; i < payment.links.length; i++) {
                console.log('payment[i].rel:', payment.links[i].rel)
                if (payment.links[i].rel === 'approval_url') {
                    token = payment.links[i].href.split('EC-', 2)[1];
                    console.log('token:', token)
                    res.send({
                        token: token,
                    });
                }
            }
        }
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
  let paymentURL = event.paymentID
  let orderId = event.orderId

  if(paymentURL && orderId){
    //we call the Alma API to get in
    try {  
         validateOrder(paymentURL, orderId)
         res.status(200).send('ok')
    } catch (err) {
      console.log(err);
      res.status(500).send({
          msg:
          err.message || `Some error occurred while finding the Alma payment with pid = ${pid} method.`
      });
  }
  }
};