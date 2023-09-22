const mongoose = require('mongoose')

const whishlistSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true,
        },
        name:{
            type:String,
            required:true
        },
        productPrice:{
            type:Number,
            required:true
        },
        promotionalPrice:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        }
    }]

})


module.exports = mongoose.model('wishlist',whishlistSchema)