const request = require('request')


module.exports = function() {
    this.validateOrder = (paymentURL,orderId) => {
    //we receive the payment, now we need to update the order
    //Firstly we validate the order

    let urlValidate = process.env.DOLIBARRURL+"/orders/"+orderId+"/validate";
    // /TODO
    let optsValidate = {
        'method': 'POST',
        'url': urlValidate,
        'headers': {
            'Content-Type': 'application/json',
            'DOLAPIKEY': process.env.DOLIBARRTOKEN // token
        }
    }
    request(optsValidate, function (errValidate, resValidate) {
        if(resValidate){
            console.log('res body', resValidate.body)
            console.log("Order "+orderId+ " has been updated to invoiced");
            //Now we update payment
            let url = process.env.DOLIBARRURL+"/orders/"+orderId;
            let json = {
                "statut" : 1,
                "array_options" : {
                    "liendepaiement" : paymentURL
                }
            }
            // /TODO
            let opts = {
                'method': 'PUT',
                'url': url,
                'headers': {
                    'Content-Type': 'application/json',
                    'DOLAPIKEY': process.env.DOLIBARRTOKEN // token
                },
                json
            }
            request(opts, function (err, res) {
                if(res){
                    console.log('res body', res.body)
                    console.log("Added payment URL : " +paymentURL+ " for Order "+orderId+ "");
                }
                //return error code
                else {
                    console.log(err);
                }
            })
        }
        //return error code
        else {
            console.log(errValidate);
        }
    })       
    };
}