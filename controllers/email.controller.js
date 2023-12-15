const nodemailer = require("nodemailer");
const fs = require('fs').promises;

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPWS,
    },
  });

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

// Create a payment intent then return the client secret
exports.contact = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      msg: "body can not be empty!"
    });
    return;
  }

  try {

    let attachments = [];
    if(req["files"] && req["files"].length){
      req["files"].forEach(element => {
        attachments.push(
          {path:element.path}
          )
      });
    }
    payload = req.body;

    let message = {
        from: "contact@hypestore.fr",
        to: "contact@hypestore.fr",
        subject: payload.subject,
        text: payload.email + " a écrit : "+payload.msg,
        attachments:attachments
      };


    transporter.sendMail(message, function(err) {
        if (err) {
            console.log(err);
            res.status(500).send({
                msg:
                err.message || "Some error occurred while finding payment method."
            });
        }else{
            attachments.forEach(async file=>{
              await deleteFile(file.path)
            })
            res.send("OK");
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


async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`File ${filePath} has been deleted.`);
  } catch (err) {
    console.error(err);
  }
}