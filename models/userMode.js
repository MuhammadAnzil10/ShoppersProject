const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    image:{
        type:String
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type:Number,
        default:0
         
    },
    is_admin:{
        type:Number,
        required:true,
    },
    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    },
    isActive:{
        type:Number,
        default:0
    },
    referralCode:{
        type:String,
    },
})


module.exports= mongoose.model('User',userSchema)