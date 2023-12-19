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
        console.log('token:', token)
        
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
        console.log('resJSON:', resJSON)
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