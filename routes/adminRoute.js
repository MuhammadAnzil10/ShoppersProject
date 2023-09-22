const express = require('express')
const admin_route = express()
const adminController = require('../controllers/adminController')
const session = require('express-session')
const config = require('../config/config')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const adminAuth = require('../middleware/adminAuth')
const nocache = require('nocache')
const path = require('path')
const couponController = require('../controllers/couponController')


// image upload using multer
const multer = require('multer')
const storage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/images/userImages'))
    },
    filename:(req,file,cb)=>{
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


admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))

admin_route.use(cookieParser())
admin_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        maxAge: 24 * 60 * 60 * 1000
    }

}))

admin_route.use(express.static('public'))


admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin');

admin_route.get('/',adminAuth.isLogout,adminController.loadLogin)
admin_route.post('/',adminController.verifyLogin)
admin_route.get('/logout',adminController.logout)

admin_route.get('/profile',adminAuth.isLogin,adminController.loadAdminProfile)

admin_route.get('/forget',adminAuth.isLogout,adminController.forgetLoad)
admin_route.post('/forget',adminController.forgetVerify)
admin_route.get('/forget-password',adminController.forgetPasswordLoad)
admin_route.post('/forget-password',adminController.resetPassword)

admin_route.get('/edit',adminAuth.isLogin,adminController.editLoad)
admin_route.post('/edit',adminController.updateProfile)

admin_route.get('/dashboard',adminAuth.isLogin,adminController.adminDashboard)

admin_route.get('/user-management',adminAuth.isLogin,adminController.loadUsersDetails)
admin_route.get('/block-user',adminAuth.isLogin,adminController.userBlock)
admin_route.get('/unblock-user',adminAuth.isLogin,adminController.userUnblock)


admin_route.get('/coupon-manage',adminAuth.isLogin,couponController.loadCoupon)
admin_route.get('/add-coupon',adminAuth.isLogin,couponController.loadAddCoupon)
admin_route.post('/add-coupon',couponController.addCoupon)
admin_route.get('/activate-coupon',adminAuth.isLogin,couponController.activateCoupon)
admin_route.get('/deactivate-coupon',adminAuth.isLogin,couponController.deactiveCoupon)
admin_route.get('/inactive-coupons',adminAuth.isLogin,couponController.loadInactiveCoupon)
admin_route.get('/edit-coupon',adminAuth.isLogin,couponController.loadCouponEdit)
admin_route.post('/edit-coupon',couponController.couponEdit)

admin_route.get('/add-referral-offer',adminAuth.isLogin,adminController.loadReferralOffer)
admin_route.post('/add-referral-offer',adminAuth.isLogin,adminController.addReferralOffer)


admin_route.get('/orders',adminAuth.isLogin,adminController.loadOrders)
admin_route.get('/order-view',adminAuth.isLogin,adminController.loadOrderView)

admin_route.get('/confirm-order',adminAuth.isLogin,adminController.confirmOrder)
admin_route.get('/order-delivered',adminAuth.isLogin,adminController.orderDelivered)
admin_route.get('/order-cancel',adminAuth.isLogin,adminController.orderCancelAccept)
admin_route.get('/order-return',adminAuth.isLogin,adminController.orderReturnAccept)
admin_route.get('/order-cancel-request',adminAuth.isLogin,adminController.orderCancelRequest)
admin_route.get('/order-cancel-return',adminAuth.isLogin,adminController.returnOrderCancel)

// chart graph 
admin_route.get('/yearly',adminAuth.isLogin,adminController.yearlySales)
admin_route.get('/monthly',adminAuth.isLogin,adminController.monthlySales)
admin_route.get('/daily',adminAuth.isLogin,adminController.dailySales)


admin_route.get('/total-sales-report',adminAuth.isLogin,adminController.loadTotalSalesReport)
admin_route.get('/download-total-sales-report',adminAuth.isLogin,adminController.downloadTotalSalesReport)
admin_route.get('/download-total-sales-report-excel',adminAuth.isLogin,adminController.downloadTotalSalesReportInExcel)


admin_route.get('/today-sales',adminAuth.isLogin,adminController.loadTodaySales)
admin_route.get('/download-today-sales',adminAuth.isLogin,adminController.downloadTodaySales)
admin_route.get('/download-today-sales-report-excel',adminAuth.isLogin,adminController.downloadTodaySalesReportInExcel)

admin_route.get('/weekly-sales-report',adminAuth.isLogin,adminController.loadWeeklySalesReport)
admin_route.get('/download-weekly-sales-report',adminAuth.isLogin,adminController.downloadWeeklySalesReport)
admin_route.get('/download-weekly-sales-report-excel',adminAuth.isLogin,adminController.downloadWeeklySalesReportInExcel)

admin_route.get('/monthly-sales-report',adminAuth.isLogin,adminController.loadMonthlySalesReport)
admin_route.get('/download-monthly-sales-report',adminAuth.isLogin,adminController.downloadMonthlySalesReport)
admin_route.get('/download-monthly-sales-report-excel',adminAuth.isLogin,adminController.downloadMonthlySalesReportInExcel)

admin_route.get('/yearly-sales-report',adminAuth.isLogin,adminController.loadYearlySalesReport)
admin_route.get('/download-yearly-sales-report',adminAuth.isLogin,adminController.downloadYearlySalesReport)
admin_route.get('/download-yearly-sales-report-excel',adminAuth.isLogin,adminController.downloadYearlySalesReportInExcel)


admin_route.get('/banner-management',adminAuth.isLogin,adminController.loadBannerManagement)
admin_route.get('/add-banner',adminAuth.isLogin,adminController.loadAddBanner)
admin_route.post('/add-banner',upload.single('image'),adminController.addBanner)
admin_route.get('/edit-banner',adminAuth.isLogin,adminController.loadEditBanner)
admin_route.post('/edit-banner',upload.single('image'),adminController.editBanner)
admin_route.get('/block-banner',adminAuth.isLogin,adminController.blockBanner)
admin_route.get('/unblock-banner',adminAuth.isLogin,adminController.unBlockBanner)





module.exports = admin_route