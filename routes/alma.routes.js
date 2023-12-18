module.exports = app => {
    const alma = require("../controllers/alma.controller");
  
    let router = require("express").Router();

    // Init alma payment
    router.post('/create-payment-intent/:installments_count', alma.createPaymentIntents // #swagger.tags = ['stripe']
    );

    // Make webhook listen
    router.get(
        "/webhook",
        alma.listen // #swagger.tags = ['clients']
    );

    // Make webhook listen
    router.post(
        "/webhook",
        alma.listen // #swagger.tags = ['clients']
    );
  
    app.use("/api/alma", router);
};