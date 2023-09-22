const mongoose = require('mongoose')

const referralSchema = new mongoose.Schema({
    referralCode:[{
        type:String,
    }],
    offerValue:{
        type:Number
    }
},{timestamps:true})


module.exports = mongoose.model('referral',referralSchema)