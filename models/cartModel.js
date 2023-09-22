const mongoose = require('mongoose')

const cartSchema = new  mongoose.Schema({

user_id :{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
products:[
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        },
        price:{
            type:Number,
            default:0
        },
        subtotal:{
            type:Number,
            default:0
        }
    }
],

totalAmount:{

    type:Number,
    default:0
},
cartSubtotal:{

    type:Number,
    default:0
},
discountValue:{
    type:Number,
    default:0
},
couponCode:{
    type:String,
    default:''
}


},{timestamps:true})




module.exports = mongoose.model('Cart',cartSchema)