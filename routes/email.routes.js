module.exports = app => {
    const email = require("../controllers/email.controller");
    const multer  = require('multer')
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./uploads/");
        },
        filename: (req, file, cb) => {
          console.log(file.originalname);
          cb(null, file.originalname);
        },
    });
    const maxSize = 5 * 1024 * 1024;
    const upload = multer({ storage: storage, limits: { fileSize: maxSize } })
  
    let router = require("express").Router();

    // Create a payment intent then confirm it
    router.post('/contact', upload.array('files[]', 5), email.contact  // #swagger.tags = ['stripe']
    );
  
    app.use("/api/email", router);
};
  