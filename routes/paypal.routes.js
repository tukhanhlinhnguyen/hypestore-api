module.exports = app => {
    const paypal = require("../controllers/paypal.controller");
  
    let router = require("express").Router();

    // Init paypal payment
    router.post('/create-payment-intent', paypal.createPaymentIntents // #swagger.tags = ['stripe']
    );

    // Make webhook listen
    router.get(
        "/webhook",
        paypal.listen // #swagger.tags = ['clients']
    );

    // Make webhook listen
    router.post(
        "/webhook",
        paypal.listen // #swagger.tags = ['clients']
    );
  
    app.use("/api/paypal", router);
};