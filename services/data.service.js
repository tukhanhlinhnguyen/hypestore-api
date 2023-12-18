module.exports = function() {
    this.calculateOrderAmount = (items) => {
      // console.log('items:', items)
      // Replace this constant with a calculation of the order's amount
      // Calculate the order total on the server to prevent
      // people from directly manipulating the amount on the client
      
      // /TODO
      let total = 0;
      items.forEach(element => {
        total+= (parseFloat(element.price) * parseInt(element.quantity));
      });
      return total*100;
    };
}