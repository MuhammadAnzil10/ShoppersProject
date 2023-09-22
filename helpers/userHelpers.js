const randomString = require('randomstring')
const nodemailer = require('nodemailer')
const config = require('../config/config')
const User = require('../models/userMode')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const PDFDocument = require('pdfkit')
const pdfHelper = require('./pdfHelper')
const fs = require('fs')

var instance = new Razorpay(
    {
         key_id: process.env.RAZORPAY_KEY_ID, 
         key_secret: process.env.RAZORPAY_KEY_SECRET 
     })

const Data ={

}


// Send Verify Mail  


const sendVerifyMail = async(name,email,otp,subject)=>{
    try{
          const transporter = nodemailer.createTransport({
                host:'smtp.ethereal.email',
                port:587,
                secure:false,
                requireTLS:true,
                auth:{
                    user:process.env.EMAIL_ETHEREAL,
                    pass:process.env.EMAIL_PASSWORD_ETHEREAL
                }
            });

            const mailOptions = {
                from:'',
                to:email,
                subject :subject,
                html:'<p>Hai '+name+', Your OTP is :'+otp+'</p>'
            }
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }
                else{
                    console.log("Email hasbeen sent: -",info.response);
                }
            })
    }
    catch(error)
    {
        console.log(error.message);
    }

}

// reset Password Mail


// for reset password send mail

const sendRestPasswordMail = async(name,email,token)=>{
    try{
          const transporter = nodemailer.createTransport({
                host:'smtp.ethereal.email',
                port:587,
                secure:false,
                requireTLS:true,
                auth:{
                    user:process.env.EMAIL_ETHEREAL,
                    pass:process.env.EMAIL_PASSWORD_ETHEREAL
                }
            });

            const mailOptions = {
                from:'muhammadanzil200@gmail.com',
                to:email,
                subject :'For Reset Password',
                html:'<p>Hai '+name+', please click here to <a href="http://localhost:3000/forget-password?token='+token+'"> Reset </a> your password.</p>'
            }
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }
                else{
                    console.log("Email hasbeen sent: -",info.response);
                }
            })
    }
    catch(error)
    {
        console.log(error.message);
    }

}


const sendOtp=(body)=>{

    try{
          console.log(body);
        const otp = randomString.generate({length:4,charset:'numeric'})
        Data.Otp=otp
        let subject ='For Verify Account'
        sendVerifyMail(body.name,body.email,otp,subject)

    }
    catch(error){
        console.log(error.message);
    }
  
}

const verifyOtp = async (body)=>{
    
    return new Promise( async (resolve,reject)=>{

        const{otp1,otp2,otp3,otp4}=body
        const combinedOtp = otp1+otp2+otp3+otp4
     
        
        if(combinedOtp === Data.Otp)
        {

              const updateInfo = await User.updateOne({_id:Data.id},{$set:{is_varified:1 }})
             
              delete Data.id
              delete Data.Otp
              
              resolve(true)
           

        }
        else{
            reject(false)
        }

    })

}

const getUser = (userId)=>{
    try{

        return new Promise(async(resolve,reject)=>{

            const userData = await User.findById({_id:userId})

            resolve(userData)
        })

    }catch(error){
        console.log(error.message);
    }
}


const generateRazorPay = (orderId,total)=>{

    return new Promise((resolve,response)=>{

        instance.orders.create({
            amount: total*100,
            currency: "INR",
            receipt: orderId,
            notes: {
              key1: "value3",
              key2: "value2"
            }
          }).then((data)=>{
         
            resolve(data)
          })
      
    })


}

const verifyPayment= async(paymentDetails,orderDetails)=>{

    return new Promise((resolve,reject)=>{

        let hmac = crypto.createHmac('sha256','Fp3wuTCJyacx5GB6peBKEOrB')
         hmac.update(paymentDetails.razorpay_order_id+'|'+paymentDetails.razorpay_payment_id)
         hmac=hmac.digest('hex')
         if(hmac === paymentDetails.razorpay_signature){
            resolve()
         }else{
            reject()
         }
    })
}
const changePaymentStatus = async(orderId)=>{

    return new Promise(async (resolve,reject)=>{

        Order.findOneAndUpdate({_id:orderId},{$set:{

            orderStatus:'Placed'
        }}).then(()=>{
            resolve()
        })
    })
}




module.exports = {

    sendOtp,
    verifyOtp,
    sendRestPasswordMail,
    getUser,
    Data,
    generateRazorPay,
    verifyPayment,
    changePaymentStatus,
    
}