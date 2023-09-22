const express = require('express')
const user_route= express();
const path = require('path')
const config = require('../config/config')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookiParser = require('cookie-parser')
const nocache = require('nocache')
const productController = require('../controllers/productController')

user_route.use(cookiParser())
user_route.use(nocache())

user_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        maxAge: 10 * 24 * 60 * 60 * 1000
    }

}))

user_route.use(express.static('public'))

// image upload using multer
const multer = require('multer')
const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/images/userImages'))
    },
    filename:(req,file,cb)=>
    {
        const name = Date.now()+'-'+file.originalname
        cb(null,name)
    }
})

const upload = multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{

    
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error("Invalid file format, Please upload an image"))
            
        }

        let maxSizeInBytes = 5 * 1024 * 1024

        if(file.size > maxSizeInBytes){
            return cb(new Error("image size exeeds maximum allowed limit is (5mb)."))
        }
        cb(null,true)
        
    }
})


//seting view engin
user_route.set('view enigine','ejs')
user_route.set('views','./views/users')

user_route.use(bodyParser.urlencoded({ extended:false}))
user_route.use(bodyParser.json())

const userController = require('../controllers/userController')
const cartController = require('../controllers/cartController')

const auth = require('../middleware/auth');





user_route.get('/',userController.loadHome)


user_route.get('/register',auth.isLogout,userController.loadRegister)
user_route.post('/register',userController.insertUser)

user_route.get('/otp',auth.isLogout,userController.otpLoad)
user_route.post('/otp',userController.otpVerify)
user_route.get('/resend-otp',auth.isLogin,userController.resendOtp)
user_route.get('/profile',auth.isLogin,userController.loadUserProfile)
user_route.get('/edit-profile',auth.isLogin,userController.loadProfileEdit)
user_route.post('/edit-profile',upload.single('image'),userController.updateProfile)

user_route.get('/adresses',auth.isLogin,userController.addressesCollection) 
user_route.get('/add-address',auth.isLogin,userController.loadAddress)
user_route.post('/add-address',userController.addAddress)
user_route.get('/edit-address',auth.isLogin,userController.loadAddressEdit)
user_route.post('/edit-address',userController.editAddress)
user_route.get('/default-address',auth.isLogin,userController.defaultAddress)
user_route.get('/delete-address',auth.isLogin,userController.deleteAddress)

user_route.get('/login',auth.isLogout,userController.loginLoad)
user_route.post('/login',userController.verifyLogin)
user_route.get('/logout',auth.isLogin,userController.userLogout)

user_route.get('/forget',auth.isLogout,userController.forgetLoad)
user_route.post('/forget',userController.forgetVerify)
user_route.get('/forget-password',auth.isLogout,userController.forgetPassWordLoad)
user_route.post('/forget-password',userController.resetPassword)
user_route.post('/change-password',auth.isLogin,userController.changePassword)

user_route.get('/verification',userController.verificationLoad)
user_route.post('/verification',userController.sentVerificationLink)


user_route.get('/products',userController.loadProducts)
user_route.get('/product',auth.isLogin,productController.loadProductPage)

user_route.get('/cart',auth.isLogin,cartController.loadCart)
user_route.post('/add-to-cart',auth.isLogin,userController.addToCart)
user_route.post('/updateQuantity',auth.isLogin,userController.cartQuantitiy)
user_route.post('/removeCartItem',auth.isLogin,userController.removeItem)

user_route.get('/checkout',auth.isLogin,userController.loadCheckout)

user_route.post('/orders',auth.isLogin,userController.addToOrder)
user_route.get('/order-success',auth.isLogin,userController.loadOrderSuccess)
user_route.post('/verify-payment',auth.isLogin,userController.verifyPayment)
user_route.get('/order-list',auth.isLogin,userController.loadOrderList)
user_route.get('/view-order-products',auth.isLogin,userController.viewOrderProducts)
user_route.get('/order-failed',auth.isLogin,userController.loadOrderFailed)

user_route.get('/about',userController.loadAbout)
user_route.get('/services',userController.loadService)
user_route.get('/contact',userController.loadContact)
user_route.post('/contact',userController.addConatactMessage)
user_route.get('/coupons',auth.isLogin,userController.loadCoupons)
user_route.post('/apply-coupon',auth.isLogin,userController.applyCoupon)
user_route.post('/remove-coupon',auth.isLogin,userController.removeCoupon)

user_route.get('/wishlist',auth.isLogin,userController.wishlistLoad)
user_route.post('/add-to-wishlist',auth.isLogin,userController.addToWishlist)

user_route.post('/wallet',auth.isLogin,userController.userWallet)

user_route.get('/cancel-order',auth.isLogin,userController.cancelOrder)
user_route.get('/return-order',auth.isLogin,userController.returnOrder)

user_route.get('/invoice',auth.isLogin,userController.invoice)


 




module.exports = user_route