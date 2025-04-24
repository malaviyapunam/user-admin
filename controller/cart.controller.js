exports.addToCart = (req, res) => {
  const cart = req.session.cart || [];
  res.render('add-cart', { cart }); 
};
  