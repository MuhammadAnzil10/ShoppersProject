const mongoose = require("mongoose");
const productHelpers = require("../helpers/productHelpers");
const User = require("../models/userMode");
const Cart = require("../models/cartModel");

const loadCart = async (req, res) => {
  try {
    const cartData = await Cart.findOne({
      user_id: req.session.user_id,
    }).populate("products.productId");

    res.render("cart", { user: req.session.user_id, cart: cartData });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

module.exports = {
  loadCart,
};
