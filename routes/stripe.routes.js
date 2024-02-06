module.exports = app => {
    const stripe = require("../controllers/stripe.controller");
  
    let router = require("express").Router();

    // Create a payment intent then confirm it
    router.post('/create-payment-intent', stripe.createPaymentIntents  // #swagger.tags = ['stripe']
    );

    // Webhook
    router.post('/webhook', stripe.listen  // #swagger.tags = ['stripe']
    );
  
    app.use("/api/stripe", router);
};
  