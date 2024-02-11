require("../services/data.service")();
const request = require('request')


// Create a payment intent then return the client secret
exports.createPaymentIntents = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      msg: "body can not be empty!"
    });Authorization:"Bearer " + access_token // token
    return;
  }

  try {
    //we create an invocie
    const { items, orderId, shippingAddress } = req.body;
    let shippingAddressStr = JSON.stringify(shippingAddress)
    let total = await calculateOrderAmount(items, orderId)
    console.log('total:', total)

    const url = `${process.env.ALMAAPIURL}/payments`;
    json = {
      "payment": {
        "installments_count": parseInt(req.params.installments_count),
        "deferred_months": 0,
        "deferred_days": 0,
        "locale": "fr",
        "expires_after": 2880,
        "capture_method": "automatic",
        "purchase_amount": total,
        "ipn_callback_url" : "https://api.hypestore.fr/api/alma/webhook",
        "return_url" : "http://localhost:4200/shop/checkout/success?redirect_status=succeeded"
      },
      "order" :{
        "merchant_reference" : orderId
      }}

      let options = {
        'method': 'POST',
        'url': url,
        'headers': {
          'access-token': process.env.TOKEN,
          'Authorization':"Alma-Auth " + process.env.ALMAAPIKEY,
          'Content-Type': 'application/json' // token
        },
        json
      }

      
      // promise syntax
      request(options, function (error, response) {
        let body = response.body.errors      
        console.log('body:', body)
        // console.log('body:', body)
        if(response && response.statusCode =="200"){
          console.log('response:', response.body.url)
          res.status(200).send({
            'alma_url' : response.body.url
          })
        }
        //return error code
        else {
          res.status(500).send((response))
        }
      })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg:
            err.message || "Some error occurred while finding payment method."
        });
    }
    }

// Create and Save a new Order
exports.listen = async (req, res) => {
    let payload = req;
    console.log('payload:', payload)
    console.log('req.body:', req.body)
    console.log('pid', req.params.pid)
    console.log('payload:', payload.url)

  };