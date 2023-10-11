const express = require('express')
const app = express()
const path= require('path')
const config = require('./config/config')
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_DB_CONNECT_URL).then(()=>{
    console.log("DB Connected Successfully");
}).catch((err)=>{console.log(err.message);})



// routes
const userRoutes = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const categoryRoute = require('./routes/categoryRoute')
const productRoute=require('./routes/productRoute')

// view engine setting
app.set('view engine','ejs')
app.set('views','views/users')

//for user route
app.use('/',userRoutes)
//for admin route
app.use('/admin',adminRoute)
//for category route
app.use('/admin/category',categoryRoute)
//for product route
app.use('/admin/product',productRoute)







app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000");
})

