import fetch from 'node-fetch';


// track a shipment via inquiryNumber
exports.track = async (req, res) => {
    // Validate request
    if (!req.params.inquiryNumber) {
      res.status(400).send({
        msg: "inquiryNumber can not be empty!"
      });
      return;
    }

    let inquiryNumber = req.params.inquiryNumber;
  
    try {
        const url = `${process.env.UPSAPIURL}/track/v1/details/${inquiryNumber}?locale=fr_FR&returnSignature=false`;
        // promise syntax
        fetch(url, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));
            // async await syntax

        const res = await fetch(url, options);
        const json = await res.json();
        console.log(json);

    } catch (err) {
        console.log(err);
        res.status(500).send({
          msg:
            err.message || "Some error occurred while finding payment method."
        });
    }
  }