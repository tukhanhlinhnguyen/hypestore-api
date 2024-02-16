const request = require('request')


module.exports = function() {
    this.calculateOrderAmount = (items,orderId) => {
      return new Promise(function (resolve, reject) {
        console.log('orderId:', orderId)
        // console.log('items:', items)
        // Replace this constant with a calculation of the order's amount
        // Calculate the order total on the server to prevent
        // people from directly manipulating the amount on the client
        let url = process.env.DOLIBARRURL+"/orders/"+orderId;

        // /TODO
        let options = {
          'method': 'GET',
          'url': url,
          'headers': {
            'Content-Type': 'application/json',
            'DOLAPIKEY': process.env.DOLIBARRTOKEN // token
          }
        }

        request(options, function (error, response) {
          if(response && response.statusCode =="200"){
            let body = JSON.parse(response.body)
            let total = 0;
            body.lines.forEach(element => {
              total+= (parseFloat(element.subprice) * parseInt(element.qty));
            });
            resolve(total*100);
          }
          //return error code
          else {
            reject(error)
          }
        })
      })
    };
}