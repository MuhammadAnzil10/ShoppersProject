const express = require('express')
const category_route = express()
const bodyParser = require('body-parser')
const adminAuth = require('../middleware/adminAuth')
const categoryController = require('../controllers/categoryController')

category_route.use(bodyParser.json())
category_route.use(bodyParser.urlencoded({extended:true}))

category_route.use(express.static('public'))


category_route.set('view engine','ejs')
category_route.set('views','./views/admin');


category_route.get('/',adminAuth.isLogin,categoryController.getCategory)

category_route.get('/add-category',adminAuth.isLogin,categoryController.addCategoryLoad)

category_route.post('/add-category',categoryController.addCategory)

category_route.get('/edit-category',adminAuth.isLogin,categoryController.categoryEditLoad)

category_route.post('/edit-category',categoryController.categoryEdit)

category_route.get('/block-category',adminAuth.isLogin,categoryController.blockCategory)

category_route.get('/unblock-category',adminAuth.isLogin,categoryController.unblockCategory)

module.exports = category_route







