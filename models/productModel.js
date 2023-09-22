const mongoose = require('mongoose')

const prodctSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    percentageDiscount: {
        type: Number,
        default: 0, 
        min: 0,
        max: 100,
      },
    regularPrice:{
        type:Number,
        required:true
    },
    productPrice:{
        type:Number,
        default:0
    },
    promotionalPrice:{

         type:Number,
         required:true
    },
    stock:{
        type:Number,
        default:0

    },
    description:{
        type:String,
        required:true

    },
    images:{
        type:[String],
        required:true

    }, 
    unlist:{
        type:Boolean,
      default:false
    }
},
{
    timestamps:true
})

module.exports = mongoose.model('Product',prodctSchema)


