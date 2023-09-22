const express = require('express')
const product_route = express()
const bodyParser = require('body-parser')
const adminAuth = require('../middleware/adminAuth')
const auth = require("../middleware/auth")
const productController = require('../controllers/productController')
const path = require('path')


// image uploadusing multer
const multer = require('multer')
const storage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/images/productImages'))
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
            return cb(new Error('image size exeeds maximum allowed limit is (5mb).'))
        }
        cb(null,true)

    }

})


product_route.use(bodyParser.json())
product_route.use(bodyParser.urlencoded({extended:true}))

product_route.use(express.static('public'))

product_route.set('view engine','ejs')
product_route.set('views','./views/admin');




product_route.get('/',adminAuth.isLogin,productController.loadProduct)

product_route.get('/add-product',adminAuth.isLogin,productController.loadAddProduct)
product_route.post('/add-product',upload.array('images',4),productController.addProduct)

product_route.get('/edit-product',adminAuth.isLogin,productController.loadEditProduct)
product_route.post('/edit-product',upload.array('images',4),productController.editProduct)
product_route.get('/remove-product-image',adminAuth.isLogin,productController.removeProductImage)

product_route.get('/block-product',adminAuth.isLogin,productController.blockProduct)
product_route.get('/unblock-product',adminAuth.isLogin,productController.unblockProduct)





module.exports = product_route