module.exports = app => {
    const ups = require("../controllers/ups.controller");
  
    let router = require("express").Router();

    // Create a payment intent then confirm it
    router.post('/track/{:inquiryNumber}', ups.track  // #swagger.tags = ['stripe']
    );
  
    app.use("/api/ups", router);
};