module.exports = app => {
    const ups = require("../controllers/ups.controller");
  
    let router = require("express").Router();

    // Check UPS status via a tracking number
    router.post('/track/{:inquiryNumber}', ups.track  // #swagger.tags = ['stripe']
    );

    // Create an auth token for the user
    router.get('/token', ups.getToken  // #swagger.tags = ['stripe']
    );
  
    app.use("/api/ups", router);
};