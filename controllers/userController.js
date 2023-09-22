const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/userMode");
const Product = require("../models/productModel");
const config = require("../config/config");
const randomString = require("randomstring");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const session = require("express-session");
const userHelper = require("../helpers/userHelpers");
const Cart = require("../models/cartModel");
const Address = require("../models/adressModel");
const Order = require("../models/orderModel");
const Coupon = require("../models/couponModel");
const Categories = require("../models/categoryModel");
const pdfHelper = require('../helpers/pdfHelper')
const PDFDocument = require('pdfkit')
const productHelpers = require('../helpers/productHelpers')
const ContactMessage= require('../models/contactMessageModel')
const Banner = require('../models/bannerModel')
const Wishlist = require('../models/wishlistModel');
const Wallet = require('../models/walletModel')
const shortId = require('shortid')
const Referral = require('../models/referralModel')

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    let message;
    if(req.query && req.query.msg){
      message = req.query.msg
    }
    res.render("signup",{message:message});
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const insertUser = async (req, res) => {
  try {
    
    const existingEmailData = await User.findOne({ email: req.body.email });
    const existingNumberData = await User.findOne({ mobile: req.body.mno });

    if (existingEmailData) {
      res.redirect('/register?msg="User Email Already existing"')
     
    } else if (existingNumberData) {
      res.redirect('/register?msg="User Number Already existing"');
    } else {
      const sPassword = await securePassword(req.body.password);
      const referral = shortId.generate()

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mno,
        password: sPassword,
        referralCode:referral,
        is_admin: 0,
      });
      const userData = await user.save();

      if (userData) {
       
        userHelper.Data.id = userData._id;
        req.session.referralId = req.body.referralCode
        req.session.body = userData;
        userHelper.sendOtp(userData)
        res.redirect(`/otp?access=${true}`)
      } else {
        res.render("signup", { message: "Your Registration hasbeen failed." });
      }

     
    }
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const otpLoad = async (req, res) => {
  try {
    if(req.query.access){
      res.render("otp");
    }else{
      res.redirect('/login')
    }
    

  } catch (error) {

    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const resendOtp = async(req,res)=>{

  try{
    const body = req.session.body
    userHelper.sendOtp(body)
    res.redirect(`/otp?access=${true}`)
  }catch(error){
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
}

const otpVerify = async (req, res) => {
  try {
    
    const userData = await User.findOne({ email: req.session.body.email });
   const referralCd = req.session.referralId
   const referrer = await User.findOne({referralCode:referralCd,_id:{$ne:userData._id}})   
    

    const otpMatch = await userHelper.verifyOtp(req.body);
    if (userData.is_varified === 0) {
      if (otpMatch)
      {
        req.session.user_id=userData._id
        

        if(referrer){
          const referral = await Referral.findOne()
         

        const wallet = new Wallet({
            userId:userData._id,
            transactions:[{
              type:'credit',
              amount:referral.offerValue,
              date:new Date()
            }],
            balance:referral.offerValue
        })
        const newWallet = await wallet.save()

        let transaction=[{
          type:'credit',
          amount:referral.offerValue,
          date:new Date()
        }]
       //---referrer offer adding--//
        let referrerWallet = await Wallet.findOne({userId:referrer._id})
       
        if(!referrerWallet){
       
          referrerWallet = new Wallet({
            userId:referrer._id,
            transactions:transaction,
            balance:referral.offerValue

          })
          await referrerWallet.save()
        }else{

          referrerWallet.transactions.push({
            type:'credit',
            amount:referral.offerValue,
            date:new Date()
          })
          referrerWallet.balance+=referral.offerValue
          await referrerWallet.save()
        }


        }
        
        res.redirect('/')
      }
      else 
      {
        res.redirect(`/otp?access=${true}`)
      }
    } else if (userData.is_varified === 1) {

      if (otpMatch)
      {
        res.redirect("/forget-password");
      } 
      else {
        res.redirect(`/otp?access=${true}`)
      }
     
    }

  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};



// login user methods

const loginLoad = async (req, res) => {
  try {
    let message;
    if(req.query && req.query.msg){
      message = req.query.msg
    }
    res.render("login",{message:message});
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.isBlocked === 0) {
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (passwordMatch) {
          if (userData.is_varified === 0) {
            res.redirect('/login?msg="Please Verify Your mail" ')
           
          } else {
            const activeData = await User.findByIdAndUpdate(
              { _id: userData._id },
              { $set: { isActive: 1 } }
            );

            req.session.user_id = userData._id;
            res.redirect("/");
          }
        } else {
          res.redirect('/login?msg="Email and Password incorrect"')
         
        }
      } else {
       
        res.redirect('/login?msg="You have been blocked by administrator Kindly please contact admin"')
       
      }
    } else {
      res.render("login", { message: "Email and Password incorrect" });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const loadHome = async (req, res) => {
  try {
    if (req.session && req.session.user_id) {
      var userData = await User.findById({ _id: req.session.user_id });
    }
    var productData = await Product.find();
    const banners = await Banner.find({isActive:true})

    res.render("home", { user: userData, product: productData,banners });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadProducts = async (req, res) => {
  try {


     productHelpers.productOffer()  

    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let page = parseInt(req.query.pages) || 1;

    const limit = 11;

    const numericSearch = parseFloat(search);

    const query = {
      $and: [
        {
          $or: [
            {
              name: { $regex: search, $options: "i" },
            },
            {
              desciption: { $regex: search, $options: "i" },
            },
          ],
        },
        { unlist: false },
      ],
    };

    if (req.query.min) {
      const minPrice = parseInt(req.query.min);
      query.$and.push({ promotionalPrice: { $gte: minPrice } });
    }
    if (req.query.max) {
      const maxPrice = parseInt(req.query.max);
      query.$and.push({ promotionalPrice: { $lte: maxPrice } });
    }

    if (req.query.category) {
      query.$and.push({ category: req.query.category });
    }

    if (!isNaN(numericSearch)) {
      query.$and[0].$or.push(
        { regularPrice: numericSearch },
        { promotionalPrice: numericSearch }
      );
    }
    

    let sortQuery={}
    if(req.query.SortBy==='ascending'){

      sortQuery={promotionalPrice:1}
    }
    if(req.query.SortBy==='descending'){
   
      sortQuery={promotionalPrice:-1}
    }

    const productsData = await Product.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);
    const itemCount = await Product.find(query).countDocuments();
    const categories = await Categories.find({ unlist: false });
  
    


    res.render("products", {
      user: req.session.user_id,
      totalPages:Math.ceil(itemCount / limit),
      currentPage: page,
      categories,
      product: productsData,
      minPrice:req.query.min,
      maxPrice:req.query.max
    });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};
const userLogout = async (req, res) => {
  try {
    const userDeActive = await User.findOneAndUpdate(
      { _id: req.session.user_id },
      { $set: { isActive: 0 } }
    );
    delete req.session.user_id;
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

// forget password code

const forgetLoad = async (req, res) => {
  try {
    const existingUser= req.query.verified
   
   let existMessage;
   existMessage = req.query.msg
    if(existingUser === 'false'){
       existMessage= "Enter a Valid Email"
    }
    res.render("forget",{message:existMessage});
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const forgetVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
   
    if (userData) {
      if (userData.is_varified === 0) {
        res.redirect(`/forget?verified=${false}`)
      } else if (userData.isBlocked === 1) {
        res.redirect('/forget?msg="You have been Blocked by Administrator "')
      } else {
        req.session.body = userData;
        userHelper.sendOtp(userData)
        res.redirect(`/otp?access=${true}`)
      }
    } else {
      res.redirect(`/forget?verified=${false}`)
      // res.render("forget", { message: "Enter a Valid Email" });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const forgetPassWordLoad = async (req, res) => {
  try {
    
    if(req.session.body){
      const userData = await User.findOne({ email: req.session.body.email });
      res.render("forget-password", { user_id: userData._id });
    }else{
      res.redirect('/login')
    }
 
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const password = req.body.password;
    const sPassword = await securePassword(password);
    const updatedData = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { password: sPassword, token: "" } }
    );
    delete req.session.body
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

// for verification sent mail link

const verificationLoad = async (req, res) => {
  try {
    res.render("mail-verification");
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const sentVerificationLink = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });

    if (userData) {
      if (userData.is_varified === 1) {
        res.render("mail-verification", {
          message: "Mail id is already verified",
        });
      } else {
        userHelper.sendVerifyMail(userData.name, userData.email, userData._id);
        res.render("mail-verification", {
          message: "Reset verification mail sent your mail Id, Please check",
        });
      }
    } else {
      res.render("mail-verification", { message: "this email is not exist" });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

// user profile edit and update

const loadUserProfile = async (req, res) => {
  try {
   let walletBalance =0;
   let referralCode = ''
    const userData = await User.findOne({ _id: req.session.user_id });

    const userWallet = await Wallet.findOne({userId:req.session.user_id})
    if(userWallet){
      walletBalance = userWallet.balance
    }
    if(userData.referralCode){
      referralCode = userData.referralCode
    }

    res.render("userProfile", { user: userData ,walletBalance,referralCode});
  } catch (error) {
  console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadProfileEdit = async (req, res) => {
  try {

    if(req.query.id){
      let userId = req.query.id;
      const userData = await User.findById({ _id: userId });
      res.render("editProfile", { user: userData });
    }
    else{
      res.redirect('/profile')
    }
    
  } catch (error) {
    res.render("404", { message: "404,  Page Not Found" });
    res.render('404',{user:req.session.user_id})
  }
};

const updateProfile = async (req, res) => {
  try {
    const emailData = await User.findOne({ email: req.body.email });
    const phoneData = await User.findOne({ mobile: req.body.mobile });
    const userData = await User.findById({ _id: req.body.user_id });

    if (emailData && emailData.email !== userData.email) {
      res.render("editProfile", {
        user: userData,
        message: "User email already existed",
      });
    } else if (phoneData && phoneData.mobile !== userData.mobile) {
      res.render("editProfile", {
        user: userData,
        message: "User phone already existed",
      });
    } else {
      if (req.file) {
        const userData = await User.findByIdAndUpdate(
          { _id: req.body.user_id },
          {
            $set: {
              name: req.body.name,
              email: req.body.email,
              mobile: req.body.mno,
              image: req.file.filename,
            },
          }
        );
      } else {
        const userData = await User.findByIdAndUpdate(
          { _id: req.body.user_id },
          {
            $set: {
              name: req.body.name,
              email: req.body.email,
              mobile: req.body.mobile,
            },
          }
        );
      }
      res.redirect("/profile");
    }
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req.session.user_id;

    var cart = await Cart.findOne({ user_id: userId });
    const product = await Product.findById({ _id: productId });

    if (product.stock > 0) {
      if (!cart) {
        cart = new Cart({ user_id: userId });
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
        cart.products[existingProductIndex].subtotal =
          cart.products[existingProductIndex].price *
          cart.products[existingProductIndex].quantity;
      } else {
        cart.products.push({
          productId,
          quantity: 1,
          price: price,
          subtotal: price,
        });
      }

      product.stock -= 1;

      cart.totalAmount = cart.products.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);

      cart.totalAmount -= cart.discountValue;

      cart.cartSubtotal = cart.products.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);

      await Promise.all([product.save(), cart.save()]);

      res.json({
        productId,
        success:true,
      });
    } else {
      res.json({
        success:false
      });
    }
  } catch (error) {
    res.render('404',{user:req.session.user_id})
  }
};

const cartQuantitiy = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.session.user_id;

    const cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const cartProduct = cart.products.find((product) => {
      return product.productId._id.toString() === productId;
    });

    if (!cartProduct) {
      return res.status(404).json({ message: "product not found in the cart" });
    }
    const currentQuantity = cartProduct.quantity;
    const product = await Product.findById({ _id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const quantityDifference = quantity - currentQuantity;

    if (quantityDifference > 0) {
      if (quantityDifference > product.stock) {
        return res.status(400).json(cart);
      }

      product.stock -= quantityDifference;
    } else if (quantityDifference < 0) {
      product.stock += Math.abs(quantityDifference);
    }

    cartProduct.quantity = quantity;

    let totalPrice = 0;
    let subTotal = 0;
    for (const product of cart.products) {
      const productPrice = product.price;
      const productSubtotal = productPrice * product.quantity;
      subTotal += product.price;
      totalPrice += productSubtotal;
      product.subtotal = productSubtotal;
    }

    cart.cartSubtotal = totalPrice;

    cart.totalAmount = totalPrice - cart.discountValue;

    await Promise.all([cart.save(), product.save()]);
    res.json(cart);
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const removeItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;


    const product = await Product.findOne({ _id: cartItemId });

    product.stock += parseInt(quantity);

    const updatedCart = await Cart.findOneAndUpdate(
      { user_id: req.session.user_id },
      {
        $pull: {
          products: { productId: cartItemId },
        },
      },
      { new: true }
    );

    let cartTotal = 0;
    for (const product of updatedCart.products) {
      cartTotal += product.price * product.quantity;
    }
    updatedCart.cartSubtotal = cartTotal;

    if (updatedCart.products.length < 1) {
      updatedCart.discountValue = 0;

      if(updatedCart.couponCode){
        const cartCoupon = await Coupon.findOne({couponCode:updatedCart.couponCode})
        cartCoupon.used=false
        await cartCoupon.save()
      }
    }
    updatedCart.totalAmount = cartTotal - updatedCart.discountValue;
   

    await Promise.all([updatedCart.save(), product.save()]);

    return res.status(200).json({
      success: true,
      subTotal: cartTotal,
      totalAmount: updatedCart.totalAmount,
      discountValue: updatedCart.discountValue,
      productLength:updatedCart.products.length
    });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadAddress = async (req, res) => {
  try {
   
    const user = await User.findById({ _id: req.session.user_id });

    res.render("address", { user });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const addAddress = async (req, res) => {
  try {

    console.log(req.query);
    const {
      name,
      phone,
      addressLine1,
      addressLine2,
      postCode,
      area,
      country,
      state,
    } = req.body;
    const userId = req.session.user_id;

    const userAddress = await Address.findOne({ user_id: userId });

    const newAddresses = {
      user_id: userId,
      name: name,
      phone: phone,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      postCode: postCode,
      area: area,
      country: country,
      state: state,
      isDefault: true,
    };

    if (!userAddress) {
      const userAddress = new Address({
        user_id: userId,
        addresses: [newAddresses],
      });
      await userAddress.save();
    } else {

      const defaultAddress = userAddress.addresses.find((address)=>{
        return address.isDefault === true
      })
      if(defaultAddress){
        defaultAddress.isDefault = false;
      }
      
      userAddress.addresses.push(newAddresses);

      await userAddress.save()
    }
    if(req.query.checkout){
      return res.redirect('/checkout')
    }
    res.redirect("/adresses");
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadAddressEdit = async (req, res) => {
  try {
    const addressId = req.query.id;
    const addresses = await Address.findOne({ user_id: req.session.user_id });
    const user = await User.findOne({ _id: req.session.user_id });
    const address = addresses.addresses.find((item) => {
      return item._id.toString() === addressId;
    });

    if (address) {
      res.render("editAddress", { address, user });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const addressesCollection = async (req, res) => {
  try {
   
    const addressData = await Address.findOne({ user_id: req.session.user_id });
    const userData = await User.find({ _id: req.session.user_id });
    if (addressData) {
      if(req.query.checkout){
        res.json(addressData)
    }else{
      res.render("addressesPage", { userAddress: addressData, user: userData });
      }
      
    } else {
      res.render("addressesPage", { user: req.session.user_id });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const editAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      addressLine1,
      addressLine2,
      postCode,
      area,
      country,
      state,
      addressId,
    } = req.body;

    const address = await Address.findOne({ "addresses._id": addressId });
    const addressFind = address.addresses.find((address) => {
      return address._id.toString() === addressId;
    });
    const updatedAddress = await Address.findOneAndUpdate(
      { "addresses._id": addressId },

      {
        $set: {
          "addresses.$.name": name,
          "addresses.$.phone": phone,
          "addresses.$.addressLine1": addressLine1,
          "addresses.$.addressLine2": addressLine2,
          "addresses.$.postCode": postCode,
          "addresses.$.area": area,
          "addresses.$.country": country,
          "addresses.$.state": state,
        },
      },
      { new: true }
    );
    res.redirect("/adresses");
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const defaultAddress = async (req, res) => {
  try {
    const addressId = req.query.id;

    const userAddresses = await Address.findOne({user_id:req.session.user_id})
    
    const defaultAddress = userAddresses.addresses.find((address)=>{
      return address.isDefault === true
    })
    
    defaultAddress.isDefault=false

   const makeDefault = userAddresses.addresses.find((address)=>{
    return address._id.toString() === addressId
   })

   makeDefault.isDefault = true
   await userAddresses.save()

    res.redirect("/adresses");
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }

};

const loadCheckout = async (req, res) => {
  try {
    let walletBalance = 0
    const user_wallet = await Wallet.findOne({userId:req.session.user_id})
    if(user_wallet){
      walletBalance=user_wallet.balance
    }

    let address;
    const userData = await userHelper.getUser(req.session.user_id);

    const addresses = await Address.findOne({ user_id: req.session.user_id });
    
    if (addresses) {
      address = addresses.addresses.find((address) => {
        return address.isDefault === true;
      });
    }
    const cart = await Cart.findOne({ user_id: req.session.user_id }).populate(
      "products.productId"
    );

    res.render("checkout", { user: userData, address: address, cart,walletBalance });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const addToOrder = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const paymentMethod = req.body.paymentMethod;
    const cart = await Cart.findOne({ user_id: userId }).populate(
      "products.productId"
    );
    const userWallet = await Wallet.findOne({userId:userId})
   
    if(paymentMethod === 'WALLET'){
       if(!userWallet){
        return res.json({lessWalletBalance:'false'})
       }
     else if((userWallet && userWallet.balance < cart.totalAmount)){
          return res.json({lessWalletBalance:'false'})
      }
    }

    const address = await Address.findOne({ user_id: userId });
    if (!address) {
      return res.json({ address: false });
    }
    const addressDefault = address.addresses.find((item) => {
      return item.isDefault === true;
    });

    if (cart.products.length < 1 || !cart) {
      return res.json({ cartItem: false });
    }
    

    let orderStatus = paymentMethod === "COD" ? "Placed" : "Pending";
        orderStatus = paymentMethod === "WALLET" ? "Placed" : "Pending";



    const orderValue = cart.totalAmount;
    const  products =await Promise.all(cart.products.map(async(item) => {
   
    const product = await Product.findOne({_id:item.productId})
   
      return {
        
        productId: item.productId,
        productName:product.name,
        productPrice:product.promotionalPrice,
        productDescription:product.description,
        quantity: item.quantity,
        total: item.subtotal,
      };
    }));
   

    const order = new Order({
      userId: userId,
      date: new Date(),
      orderValue: orderValue,
      paymentMethod: paymentMethod,
      orderStatus: orderStatus,
      products: products,
      addressDetails: addressDefault,
      couponCode:cart.couponCode,
      couponDiscount:cart.discountValue
      
    });

    await order.save();

    const coupon = await Coupon.findOne({couponCode:cart.couponCode})
    
    if(coupon){
      coupon.used=false
      coupon.save()
    }



    if (order) {
      const deletedCart = await Cart.findOneAndDelete({
        user_id: req.session.user_id,
      });
    }
    const orderId = order._id.toString();

    if (paymentMethod === "COD") {
      res.json({ codSuccess: true });
    }else if(paymentMethod === "WALLET"){

      const transaction = {
        type:'debit',
        amount:orderValue,
        date:new Date()
      }
      if(userWallet){
        userWallet.transactions.push(transaction)
      userWallet.balance-=orderValue
      await userWallet.save()
      }
      
      res.json({ walletSuccess: true });

    } else if (paymentMethod === "ONLINE") {
      const response = await userHelper.generateRazorPay(orderId, orderValue);
    
      res.json(response);
    }
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadOrderSuccess = async (req, res) => {
  try {
    const user = req.session.user_id;
    res.render("orderSuccess", { user });
  } catch (error) {
    console.log(error.message);
  }
};
const verifyPayment = async (req, res) => {
  try {
    const paymentDetails = req.body.payment;
    const orderDetails = req.body.order;

    userHelper.verifyPayment(paymentDetails, orderDetails).then(() => {
      userHelper
        .changePaymentStatus(orderDetails.receipt)
        .then(() => {
          console.log("payment successfull");
          res.json({ status: true });
        })
        .catch((error) => {
          res.json({ status: false });
        });
    });
  } catch (error) {
    console.log(error);
    res.render('404',{user:req.session.user_id})
  }
};

const loadOrderList = async (req, res) => {
  try {
    const order = await Order.find({ userId: req.session.user_id });

    res.render("orderList", { user: req.session.user_id, order });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const viewOrderProducts = async (req, res) => {
  try {
    const orderId = req.query.id;
    const order = await Order.findOne({ _id: orderId })
      .populate("userId")
      .populate("products.productId");
    // const orders = await Order.findOne({ _id: orderId }).populate("products.productId");
    // const user = await User.findOne({ _id: req.session.user_id });

    // const products = orders.products.map((product) => {

    //   return {

    //     productId: product.productId,
    //     quantity: product.quantity,
    //     total: product.total,
    //   };
    // });

    res.render("orderProducts", { user: req.session.user_id, order });
  } catch (error) {
    console.log(error.message);
   
    res.render('404',{user:req.session.user_id})
  }
};

const loadAbout = async (req, res) => {
  try {
    res.render("aboutUs", { user: req.session.user_id });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadService = async (req, res) => {
  try {
    res.render("services", { user: req.session.user_id });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadContact = async (req, res) => {
  try {
    res.render("contact", { user: req.session.user_id });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const addConatactMessage=async(req,res)=>{
  try{

    const {firstName,lastName,email,message}=req.body

    const contactMsg = new ContactMessage({
      
      firstName,
      lastName,
      email,
      message
    })

    const newContactMsg = await contactMsg.save()
    console.log(newContactMsg);
    res.json({success:true})

  }catch(error){
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
}

const loadCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ activeCoupon: true });

    res.json(coupons);
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { inputeCoupon, subTotal } = req.body;
  
    const cart = await Cart.findOne({ user_id: req.session.user_id });
    const cartCoupon = await Coupon.findOne({ couponCode: cart.couponCode });

    const coupon = await Coupon.findOne({ couponCode: inputeCoupon });

    if (!coupon) {
      return res.json({ isValidCoupon: false });
    }

    if (cartCoupon && cart.couponCode !== inputeCoupon) {
      cartCoupon.usageCount += 1;
      cartCoupon.used = false;
      await cartCoupon.save();
    }
    const currentDate = new Date();
    const exprirationDate = new Date(coupon.createdOn);
    exprirationDate.setDate(exprirationDate.getDate() + coupon.validFor);

    if (currentDate > exprirationDate) {
      return res.json({ isCouponExpired: true });
    }

    let discountAmount = Math.round(
      (coupon.discountPercentage / 100) * subTotal
    );

    if (discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }

    if (coupon.used) {
      return res.json({ usage: true });
    }

    if (coupon.usageCount !== undefined && coupon.usageCount <= 0) {
      return res.json({ count: false });
    }
    if (subTotal < coupon.minOrderValue) {
      return res.json({ minimumOrderValue: false });
    }
    if (coupon.usageCount !== undefined) {
      coupon.usageCount -= 1;
    }
    cart.discountValue = discountAmount;
    cart.totalAmount = subTotal - discountAmount;
    cart.couponCode = inputeCoupon;

    coupon.used = true;
    // req.session.coupon = coupon.couponCode;
    await Promise.all([coupon.save(), cart.save()]);

    res.json({
      couponData: coupon,
      total: cart.totalAmount,
      discount: discountAmount,
    });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const removeCoupon = async (req, res) => {
  try {
    const cartCoupon = await Cart.findOne({ user_id: req.session.user_id });
    if (cartCoupon.couponCode !== "") {
      const coupon = await Coupon.findOne({
        couponCode: cartCoupon.couponCode,
      });

      // delete req.session.coupon;

      let offeValue = cartCoupon.discountValue;
      cartCoupon.totalAmount += offeValue;
      cartCoupon.discountValue = 0;
      coupon.usageCount += 1;
      coupon.used = false;
      cartCoupon.couponCode = "";

      await Promise.all([cartCoupon.save(), coupon.save()]);

      res.json({ noCouponApplied: false, cartCoupon });
    } else {
      res.json({ noCouponApplied: true, cartCoupon });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.query.id;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          cancellationStatus: "Requested",
        },
      }
    );

    res.redirect(`/view-order-products?id=${orderId}`);
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const returnOrder = async (req, res) => {
  try {
    const orderId = req.query.id;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          orderStatus: "Return requested",
        },
      }
    );

    res.redirect(`/view-order-products?id=${orderId}`);
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})

  }
};

const loadOrderFailed = async (req, res) => {
  try {
    res.render("orderFailed", { user: req.session.user_id });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const invoice = async(req,res)=>{
  try{

      
    let doc = new PDFDocument({size:"A4",margin:50})
    
    let paths = 'Invoice.pdf'
    const orderId = req.query.id
    const order = await Order.findOne({_id:orderId})

    pdfHelper.generateHeader(doc)
    pdfHelper.generateCustomerInformation(doc,order)
    pdfHelper.generateInvoiceTable(doc,order)
    pdfHelper.generateFooter(doc)

    doc.end()
    doc.pipe(res)

  }catch(error){
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
}

const deleteAddress = async (req,res)=>{
  try{

    const addressId = req.query.id
    const userId = req.session.user_id

     
    const userAddresses = await Address.findOne({user_id:userId})
   
  
    const addressToDelete =  userAddresses.addresses.find((address)=>{

        return address._id.toString() === addressId
    })
    
    if(addressToDelete.isDefault){
      const otherAddresses = userAddresses.addresses.filter((address) => address._id != addressId);
     
      if(otherAddresses.length > 0){
        const newDefaultAddress= otherAddresses[0]
        newDefaultAddress.isDefault=true
      }
    }

    userAddresses.addresses.pull(addressId);

   await userAddresses.save()

   res.redirect('/adresses')



  }catch(error){
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
}


const changePassword =async(req,res)=>{

  try{

    const {userId,newPassword,oldPassword}=req.body
     
    const userData = await User.findOne({_id:userId})

    const passwordMatch = await bcrypt.compare(oldPassword,userData.password)
    
    if(passwordMatch){
 
      const sPassword = await securePassword(newPassword)
      console.log(userData);
      userData.password=sPassword
      userData.save()

      res.json({success:true})

    }else{
      res.json({success:false})
    }

  }catch(error){
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
}

const wishlistLoad = async(req,res)=>{

  try{
    const wishlists = await Wishlist.findOne({userId:req.session.user_id}).populate("products.productId");
    res.render('wishlistPage',{wishlists,user:req.session.user_id})

  }catch(error){
    console.log(error.message);

    res.render('404',{user:req.session.user_id})
  }

}

const addToWishlist = async(req,res)=>{
  try{
    let wishlistPage = false;

    if(req.query && req.query.wishlist){
      wishlistPage = true;
    }
    const productId = req.body.productId
   
    const productData = await Product.findOne({_id:productId})
  
    let newProduct ={
      productId:productData._id,
      name:productData.name,
      productPrice:productData.regularPrice,
      promotionalPrice:productData.promotionalPrice,
      description:productData.description,
      image:productData.images[0]

    }

    let wishlists = await Wishlist.findOne({userId:req.session.user_id})

    if(!wishlists){
      wishlists = new Wishlist(
        {
          userId:req.session.user_id,
          
        })
        await wishlists.save()
      }

      const isProductInWishlist = wishlists.products.find((product)=>{
        return product.productId.toString() === productId
      })

      if(!isProductInWishlist){
        wishlists.products.push(newProduct)
        await wishlists.save()
       
       return res.json({
        added:true,
        message:'Product added to wishlist'})
      }else{

        wishlists.products = wishlists.products.filter((product)=>{
            return product.productId.toString() !== productId
          })
          
          await wishlists.save()
        
          return res.json({
            productId,
            removed:true,
            wishlistPage,
            message:'Product removed from wishlist'})
      }

  }catch(error){
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
}

const userWallet = async(req,res)=>{
  try{
    const userId = req.session.user_id
    const amount = req.body.amount

    let wallet = await Wallet.findOne({userId:req.session.user_id})
    
    if(!wallet){
    wallet =new Wallet({
      userId:userId,
      transactions:[]

    })
   await wallet.save()
    }
  const transaction ={
    type:'credit',
    amount,
    date:new Date(),
  }

  wallet.transactions.push(transaction)
  wallet.balance += amount
  const updatedWallet = await wallet.save()
  res.json(updatedWallet)
  }catch(error){
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
}
module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  forgetLoad,
  forgetVerify,
  forgetPassWordLoad,
  resetPassword,
  verificationLoad,
  sentVerificationLink,
  sentVerificationLink,
  updateProfile,
  securePassword,
  loadProducts,
  loadUserProfile,
  loadProfileEdit,
  otpVerify,
  otpLoad,
  addToCart,
  cartQuantitiy,
  removeItem,
  loadAddress,
  addAddress,
  addressesCollection,
  loadAddressEdit,
  editAddress,
  defaultAddress,
  loadCheckout,
  addToOrder,
  loadOrderSuccess,
  verifyPayment,
  loadOrderList,
  viewOrderProducts,
  loadAbout,
  loadService,
  loadContact,
  loadCoupons,
  applyCoupon,
  removeCoupon,
  cancelOrder,
  returnOrder,
  loadOrderFailed,
  invoice,
  deleteAddress,
  resendOtp,
  addConatactMessage,
  changePassword,
  wishlistLoad,
  addToWishlist,
  userWallet

};
