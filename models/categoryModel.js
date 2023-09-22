const mongoose = require('mongoose')

const categorySchema =  mongoose.Schema({

    name:{
        type:String,
        required:true,
        
    },
    description:{

        type:String,
        required:true

    },
    percentageDiscount: {
        type: Number,
        default: 0, 
        min: 0,
        max: 100,
      },
    unlist:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
)



module.exports = mongoose.model('category',categorySchema)