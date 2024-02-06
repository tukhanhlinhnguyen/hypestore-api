const request = require('request')

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
      const url = `${process.env.UPSAPIURL}/api/track/v1/details/${inquiryNumber}?locale=fr_FR&returnSignature=false`;
      getTokenServer(function(token){
        
        let options = {
          'method': 'GET',
          'url': url,
          'headers': {
            'authorization': "Bearer "+token,
            'transactionSrc': 'testing',
            'transId' : 'string'
          }
        }
        
        // promise syntax
        request(options, function (error, response) {
          if(response.statusCode === 200){
            res.status(200).send(response.body)
          }else{
            res.status(500).send(response.body)
          }
  
        })
      });

    } catch (err) {
        console.log(err);
        res.status(500).send({
          msg:
            err.message || "Some error occurred while finding payment method."
        });
    }
}

function getTokenServer(callback){

  try {
    const url = `${process.env.UPSAPIURL}/security/v1/oauth/token`;

    
    let username = process.env.UPSUSERNAME;
    let password = process.env.UPSPWD;
    let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    let json = {"grant_type" : "client_credentials"}

    let options = {
      'method': 'POST',
      'url': url,
      'headers': {
        'access-token': process.env.TOKEN,
        'Authorization': auth,
        'Content-Type':'application/x-www-form-urlencoded'     
      },
      'form': {
        grant_type: 'client_credentials',
    },
      
    }
    
    // promise syntax
    return request(options, async function (error, response) {
      if(response.statusCode === 200){
        let resJSON = await JSON.parse(response.body)
        let access_token = resJSON.access_token
        let expires_in = resJSON.expires_in
        callback(access_token);
      }else{
        callback(false);
      }
    })

  } catch (err) {
      console.log(err);
      callback(false);
  }
}


exports.getToken = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      msg: "body can not be empty!"
    });
    return;
  }

  try {
    const url = `${process.env.UPSAPIURL}/security/v1/oauth/token`;

    
    let username = process.env.UPSUSERNAME;
    let password = process.env.UPSPWD;
    let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    let json = {"grant_type" : "client_credentials"}

    let options = {
      'method': 'POST',
      'url': url,
      'headers': {
        'access-token': process.env.TOKEN,
        'Authorization': auth,
        'Content-Type':'application/x-www-form-urlencoded'     
      },
      'form': {
        grant_type: 'client_credentials',
    },
      
    }
    
    // promise syntax
    request(options, function (error, response) {
      if(response.statusCode === 200){
        let resJSON = JSON.parse(response.body)
        let access_token = resJSON.access_token
        let expires_in = resJSON.expires_in
        res.status(200).send({
          'access_token:' : access_token,
          'expires_in' : expires_in
        }) 
      }else{
        res.status(500).send({'response:': response});
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

//Create a UPS label
// track a shipment via inquiryNumber
exports.create = async (order_id, shippingAddress) => {

  try {
    const url = `${process.env.DOLIBARRURL}/orders/${order_id}`;

    let options = {
      'method': 'GET',
      'url': url,
      'headers': {
        'DOLAPIKEY': process.env.DOLIBARRTOKEN,
      }
    }
    // promise syntax
    request(options, function (error, response) {
      if(response.statusCode === 200){
        let resJSON = JSON.parse(response.body)
        const url = `${process.env.UPSAPIURL}/api/shipments/v1/ship`;

        getTokenServer(function(token){
          let json = createShippmentJson(resJSON, shippingAddress);
          
          let options = {
            'method': 'POST',
            'url': url,
            'headers': {
              'authorization': "Bearer "+token,
              'transactionSrc': 'testing',
              'transId' : 'string'
            },
            json
          }
          
          // promise syntax
          request(options, function (error, response) {
            console.log('🌅🌅🌅🌅🌅🌅🌅🌅🌅🌅🌅🌅🌅🌅', response.body)
            
            if(response.statusCode === 200){
              const url = `${process.env.DOLIBARRURL}/orders/${order_id}`;

              let options = {
                'method': 'GET',
                'url': url,
                'headers': {
                  'DOLAPIKEY': process.env.DOLIBARRTOKEN,
                }
              }
            }
          })
        });


      }else{
        // res.status(500).send(response.body)
      }

    })
  } catch (err) {
      console.log(err);
      // res.status(500).send({
      //   msg:
      //     err.message || "Some error occurred while finding payment method."
      // });
  }
}



function createShippmentJson(json, shippingAddress){
  let shipmentRequest = {
    "ShipmentRequest": {
      "Request": {
        "SubVersion": "1801",
        "RequestOption": "nonvalidate",
        "TransactionReference": {
          "CustomerContext": "Commande 1"
        },
        "Description": json.id,
      },
      "Shipment": {
        "ReferenceNumber": {
          "Code": "ON",
          "Value": json.id
        },
        "Description": json.id,
        "Shipper": {
          "Name": "Hype Store",
          "AttentionName": "Hype Store",
          "Phone": {
            "Number": "0749658883",
            "Extension": " "
          },
          "ShipperNumber": "F9247K",
          "Address": {
            "AddressLine": [
              "5 Rue Louis Rège"
            ],
            "City": "Marseille",
            "StateProvinceCode": "13",
            "PostalCode": "13007",
            "CountryCode": "FR"
          }
        },
        "ShipTo": {
          "Name": shippingAddress.firstName +" "+ shippingAddress.lastName,
          "AttentionName": "",
          "Phone": {
            "Number": shippingAddress.phone.replaceAll(' ', '')
          },
          "Address": {
            "AddressLine": [
              shippingAddress.address
            ],
            "City": shippingAddress.town,
            "StateProvinceCode": "",
            "PostalCode": shippingAddress.zip,
            "CountryCode": "FR"
          },
          "Residential": " "
        },
        "ShipFrom": {
          "Name": "Hype Store",
          "AttentionName": "Hype Store",
          "Phone": {
            "Number": "0749658883",
          },
          "FaxNumber": "",
          "Address": {
            "AddressLine": [
              "5 Rue Louis Rège"
            ],
            "City": "Marseille",
            "StateProvinceCode": "13",
            "PostalCode": "13007",
            "CountryCode": "FR"
          }
        },
        "PaymentInformation": {
          "ShipmentCharge": {
            "Type": "01",
            "BillShipper": {
              "AccountNumber": "F9247K"
            }
          }
        },
        "Service": {
          "Code": "07",
          "Description": "Express"
        },
        "Package": {
          "Description": json.id,
          "Packaging": {
            "Code": "02",
            "Description": ""
          },
          "Dimensions": {
            "UnitOfMeasurement": {
              "Code": "CM",
              "Description": "CM"
            },
            "Length": "10",
            "Width": "30",
            "Height": "45"
          },
          "PackageWeight": {
            "UnitOfMeasurement": {
              "Code": "KGS"
            },
            "Weight": "1"
          }
        }
      },
      "LabelSpecification": {
        "LabelImageFormat": {
          "Code": "GIF",
          "Description": "GIF"
        },
        "HTTPUserAgent": "Mozilla/4.5"
      }
    }
  };
  // Convert to JSON
  let jsonShipmentRequest = JSON.stringify(shipmentRequest, null, 2);
  jsr = JSON.parse(jsonShipmentRequest)
  console.log(jsr);
  return jsr;
}