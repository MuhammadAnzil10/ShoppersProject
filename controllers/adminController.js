const bcrypt = require("bcrypt");
const User = require("../models/userMode");
const randomString = require("randomstring");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const Admin = require("../models/adminModel");
const Order = require("../models/orderModel");
const orderHelper = require('../helpers/orderHelper')
const adminHelper = require('../helpers/adminHelpers')
const PDFDocument = require('pdfkit')
const Excel = require('exceljs')
const fs = require('fs')
const Banner = require('../models/bannerModel');
const walletModel = require("../models/walletModel");
const Referral = require('../models/referralModel')


//---------- password hashing ---------//

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

//----------- loging page load --------//

const loadLogin = async (req, res) => {
  try {
   
    res.render("login");
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const loadAdminProfile = async (req, res) => {
  try {
    const adminData = await Admin.find();

    res.render("home", { admin: adminData });
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

// send mail

const sendResetPassword = (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_ETHEREAL,
        pass: process.env.EMAIL_PASSWORD_ETHEREAL,
      },
    });

    const mailOptions = {
      from: "muhammadanzil200@gmail.com",
      to: email,
      subject: "For Verification mail",
      html:
        "<p> hai " +
        name +
        ',Please click here to <a href="http://localhost:3000/admin/forget-password?token=' +
        token +
        '">Reset</a> your password</p> ',
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Email hasbeen sent : -" + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};



const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const adminData = await Admin.findOne({ email: email });

    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);

      if (passwordMatch) {
        req.session.admin_id = adminData._id;
        res.redirect("/admin/dashboard");
      } else {
        res.render("login", { message: "email and password are incorrect" });
      }
    } else {
      res.render("login", { message: "email and password are incorrect" });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const loadDashboard = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.admin_id });
    res.render("dashboard", { admin: adminData });
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const logout = async (req, res) => {
  try {
    delete req.session.admin_id;
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const forgetLoad = async (req, res) => {
  try {
    res.render("forget");
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
  
};

const forgetVerify = async (req, res) => {
  try {
    const email = req.body.email;

    const adminData = await Admin.findOne({ email: email });

    if (adminData) {
      const random_string = randomString.generate();
      const updatedData = await Admin.updateOne(
        { email: email },
        { $set: { token: random_string } }
      );
      sendResetPassword(adminData.name, adminData.email, random_string);
      res.render("forget", {
        message: "please check your mail to reset your password",
      });
    } else {
      res.render("forget", { message: "Email is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const forgetPasswordLoad = async (req, res) => {
  try {
    const token = req.query.token;

    const tokenData = await Admin.findOne({ token: token });

    if (tokenData) {
      res.render("forget-password", { admin_id: tokenData._id });
    } else {
      res.render("404", { message: "key invalid link" });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const resetPassword = async (req, res) => {
  try {
    const admin_id = req.body.admin_id;
    const password = req.body.password;

    const sPassword = await securePassword(password);

    const updatedData = await Admin.findByIdAndUpdate(
      { _id: admin_id },
      { $set: { password: sPassword, token: "" } }
    );

    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const editLoad = async (req, res) => {
  try {
    const id = req.query.id;

    const adminData = await Admin.findById({ _id: id });

    if (adminData) {
      res.render("edit", { admin: adminData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const updateProfile = async (req, res) => {
  try {
   
    if (req.body) {
      const adminData = await Admin.findByIdAndUpdate(
        { _id: req.body.admin_id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
          },
        }
      );
    
    }

    res.redirect("/admin/profile");
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const adminDashboard = async (req, res) => {
  try {

    res.render("dashboard");
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};



// users details handling

const loadUsersDetails = async (req, res) => {
  try {
    const userData = await User.find();
    const adminData = await Admin.find();
    if (userData) {
      res.render("user-management", { user: userData, admin: adminData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const userBlock = async (req, res) => {
  try {
    const userId = req.query.id;
    const blockedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { isBlocked: 1 } }
    );
    
     res.json({success:true})
    

  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const userUnblock = async (req, res) => {
  try {
    const userId = req.query.id;

    const unblockedUserData = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { isBlocked: 0 } }
    );

    res.json({success:true})
    
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const loadOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId");
    res.render("order-management", { orders });
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const loadOrderView = async (req, res) => {
  try {
    const orderId = req.query.id;

    const order = await Order.findOne({ _id: orderId })
      .populate("userId")
      .populate("products.productId");
    console.log(order);
    res.render("orderView", { order });
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const confirmOrder = async (req, res) => {
  try {
    const orderId = req.query.id;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: { orderStatus: "Confirm" } }
    );
    
    res.redirect(`/admin/order-view?id=${orderId}`);
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const orderDelivered = async (req, res) => {
  try {
    const orderId = req.query.id;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          orderStatus: "Delivered",
        },
      }
    );

    res.redirect(`/admin/order-view?id=${orderId}`);
  } catch (error) {
    console.log(error.message);
  }
};

const orderCancelAccept = async (req, res) => {
  try {
    const orderId = req.query.id;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          cancellationStatus: "Accepted",
          orderStatus: "Returned",
          cancelledOrder: true,
        },
      }
    );
    if(updatedOrder.paymentMethod === "WALLET"){
      let userWallet = await walletModel.findOne({userId:req.session.user_id})
      userWallet.balance+=updatedOrder.orderValue
      await userWallet.save()
    }
    

    res.redirect(`/admin/order-view?id=${orderId}`);
  } catch (error) {
    console.log(error);
    res.render('404')
  }
};

const orderReturnAccept = async (req, res) => {
  try {
    const orderId = req.query.id;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          orderStatus: "Returned",
        },
      }
    );
    if(updatedOrder.paymentMethod === "WALLET"){
      let userWallet = await walletModel.findOne({userId:req.session.user_id})
      userWallet.balance+=updatedOrder.orderValue
      await userWallet.save()
    }
    res.redirect(`/admin/order-view?id=${orderId}`);
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const orderCancelRequest = async (req, res) => {
  try {
    const orderId = req.query.id;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          cancellationStatus: "Cancelled",
          orderStatus: "Returned",

        },
      }
    );
    if(updatedOrder.paymentMethod === "WALLET"){
      let userWallet = await walletModel.findOne({userId:req.session.user_id})
      userWallet.balance+=updatedOrder.orderValue
      await userWallet.save()
    }

    res.redirect(`/admin/order-view?id=${orderId}`);
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};

const returnOrderCancel = async (req, res) => {
  try {
    const orderId = req.query.id;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          orderStatus: "Delivered",
        },
      }
    );

    res.redirect(`/admin/order-view?id=${orderId}`);
  } catch (error) {
    console.log(error.message);
    res.render('404')
  }
};


const yearlySales = async(req,res)=>{
  try{

  
    const aggregateData = await Order.aggregate([
      
       {$match:{cancelledOrder:false,orderStatus:{$ne:'Returned'}}},
       {
        
        $group:{
          _id:{  year:{$year:'$date'}},
          totalOrderValue:{$sum:'$orderValue'}
    }
        
  },
  {
    $project:{_id:0,year:'$_id.year',totalOrderValue:1}
  }
  ,
  {$sort:{'_id.year':1}}
    ])

    res.json(aggregateData)
  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const monthlySales = async (req,res)=>{

  try{
   
    const aggregateData = await Order.aggregate([
      {$match:{cancelledOrder:false,orderStatus:{$ne:'Returned'}}},
      {$group:{
        _id:{
          year:{$year:'$date'},
          month:{$month:'$date'}
        },
          totalOrderValue:{$sum:'$orderValue'}
      }},
      {$project:{_id:0,year:'$_id.year',month:'$_id.month',totalOrderValue:1}},
      {$sort:{'_id.year':1,'_id.month':1}}
    ])

    res.json(aggregateData)
  }catch(error){

    console.log(error.message);
    res.render('404')
  }

}

const dailySales = async(req,res)=>{

  try{

    const aggregateData = await Order.aggregate([
      {$match:{cancelledOrder:false,orderStatus:{$ne:'Returned'}}},
      {$group:{
        _id:{
          year:{$year:'$date'},
          month:{$month:'$date'},
          day:{$dayOfMonth:'$date'}
        },
        totalOrderValue:{$sum:'$orderValue'}
      }},
      {$project:{_id:0,year:'$_id.year',month:'$_id.month',day:'$_id.day',totalOrderValue:1}},
      {$sort:{'_id.year':1,'_id.month':1,'_id.day':1}}
    ])
 res.json(aggregateData)
  }catch(error){
    console.log(error.message)
    res.render('404')


  }

}

const loadTotalSalesReport = async (req,res)=>{
  try{

    const orders = await Order.find({cancelledOrder:false,orderStatus:{$ne:'Returned'}}).populate('userId')
    res.render('totalSales',{orders})


  }catch(error){
          console.log(error.message);
          res.render('404')
  }
}




const downloadTotalSalesReport = async(req,res)=>{


  try{
    const doc = new PDFDocument({size:"A4",margin:50})
     const orders = await Order.find({orderStatus:{$ne:'Returned'},cancelledOrder:false}).populate('userId')
     await adminHelper.salesPdf(orders,doc)
     doc.pipe(res)
     res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"');
     res.setHeader('Content-Type', 'application/pdf');
     
  }catch(error){
    console.log(error.message)
    res.render('404')
  }
}

const downloadTotalSalesReportInExcel = async(req,res)=>{

  try{
    const workbook = new Excel.Workbook()
    const orders = await Order.find({orderStatus:{$ne:'Returned'},cancelledOrder:false}).populate('userId')
      
    adminHelper.reportExcel(workbook,orders)

    const fileName = `sales-report-${Date.now()}.xlsx`

    await workbook.xlsx.writeFile(fileName)

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);

    fileStream.on('close', () => {
      fs.unlinkSync(fileName);
    });

  }catch(error){
    console.log(error.message);
    res.render('404')
  }

}

const loadTodaySales = async(req,res)=>{
  try{

    const today = new Date()
    today.setHours(0,0,0,0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate()+1)

    const orders = await Order.find({
      date:{
        $gte:today,
        $lte:tomorrow
      },cancelledOrder:false,orderStatus:{$ne:'Returned'}
    }).populate('userId')
    res.render('todaySales',{orders})

  }catch(error){
    console.log(error);
    res.render('404')
  }
}

const downloadTodaySales = async(req,res)=>{
  try{

    const doc = new PDFDocument({size:"A4",margin:50})

    const today = new Date()
    today.setHours(0,0,0,0,)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate()+1)

    const orders = await Order.find({
      date:{
        $gte:today,
        $lte:tomorrow
      },orderStatus:{$ne:'Returned'},cancelledOrder:false
    }).populate('userId')

    adminHelper.salesPdf(orders,doc)

    doc.pipe(res)
    res.setHeader('Content-Disposition','attachment;filename="today-sales-report.pdf"')
    res.setHeader('Content-Type','application/pdf')

  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const downloadTodaySalesReportInExcel = async(req,res)=>{
  try{

    const workbook = new Excel.Workbook()
    const today = new Date()
    today.setHours(0,0,0,0,)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate()+1)

    const orders = await Order.find({
      date:{
        $gte:today,
        $lte:tomorrow
      },orderStatus:{$ne:'Returned'},cancelledOrder:false
    }).populate('userId')

    adminHelper.reportExcel(workbook,orders)

    const fileName = `today-sales-report-${Date.now()}.xlsx`
    await workbook.xlsx.writeFile(fileName)
    
    res.setHeader('Content-Disposition',`attachment;filename=${fileName}`)
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    
    const fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);

    fileStream.on('close', () => {
      fs.unlinkSync(fileName);
    });


  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}


const loadWeeklySalesReport = async (req,res)=>{

try{
  
  let year,week,selectedWeek,firstDayOfWeek,lastDayOfWeek;
  

    if(req.query.selectedWeek){
     selectedWeek = req.query.selectedWeek
     year = parseInt(selectedWeek.substring(0,4),10)
     week = parseInt(selectedWeek.substring(6),10)

    firstDayOfWeek = new Date(year,0,1+(week-1)*7)
    lastDayOfWeek = new Date(year,0,1+(week-1)*7+6)

  lastDayOfWeek.setHours(23,59,59,999)
  
    }
    else{

      const today = new Date()
      firstDayOfWeek=new Date(today.getFullYear(),today.getMonth(),today.getDate()-today.getDay())
      firstDayOfWeek.setHours(0,0,0,0)
      lastDayOfWeek = new Date(firstDayOfWeek)
      lastDayOfWeek.setDate(lastDayOfWeek.getDate()+7)

    }

    const orders = await Order.find({
      date:{
        $gte:firstDayOfWeek,
        $lte:lastDayOfWeek
      },orderStatus:{$ne:'Returned'},cancelledOrder:false
    })

  res.render('weeklySales',{orders})

}catch(error){
  console.log(error.message);
  res.render('404')
}

}

const downloadWeeklySalesReport = async(req,res)=>{

  try{

    
   
    let year,week,selectedWeek,firstDayOfWeek,lastDayOfWeek;
  

    if(req.query.selectedWeek){
     selectedWeek = req.query.selectedWeek
     year = parseInt(selectedWeek.substring(0,4),10)
     week = parseInt(selectedWeek.substring(6),10)

    firstDayOfWeek = new Date(year,0,1+(week-1)*7)
    lastDayOfWeek = new Date(year,0,1+(week-1)*7+6)

  lastDayOfWeek.setHours(23,59,59,999)
  
    }
    else{

      const today = new Date()
      firstDayOfWeek=new Date(today.getFullYear(),today.getMonth(),today.getDate()-today.getDay())
      firstDayOfWeek.setHours(0,0,0,0)
      lastDayOfWeek = new Date(firstDayOfWeek)
      lastDayOfWeek.setDate(lastDayOfWeek.getDate()+7)

    }

    const orders = await Order.find({
      date:{
        $gte:firstDayOfWeek,
        $lte:lastDayOfWeek
      },orderStatus:{$ne:'Returned'},cancelledOrder:false
    }).populate('userId')
   

    const doc = new PDFDocument({size:"A4",margin:50})
   await adminHelper.salesPdf(orders,doc)
    doc.pipe(res)
    
    res.setHeader('Content-Disposition','attachment;filename="weekly-sales-report.pdf"')
    res.setHeader('Content-Type','application/pdf')



  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const downloadWeeklySalesReportInExcel = async(req,res)=>{
  try{

    const workbook = new Excel.Workbook()
     
    let year,week,selectedWeek,firstDayOfWeek,lastDayOfWeek;
  

    if(req.query.selectedWeek){
     selectedWeek = req.query.selectedWeek
     year = parseInt(selectedWeek.substring(0,4),10)
     week = parseInt(selectedWeek.substring(6),10)

    firstDayOfWeek = new Date(year,0,1+(week-1)*7)
    lastDayOfWeek = new Date(year,0,1+(week-1)*7+6)

  lastDayOfWeek.setHours(23,59,59,999)
  
    }
    else{

      const today = new Date()
      firstDayOfWeek=new Date(today.getFullYear(),today.getMonth(),today.getDate()-today.getDay())
      firstDayOfWeek.setHours(0,0,0,0)
      lastDayOfWeek = new Date(firstDayOfWeek)
      lastDayOfWeek.setDate(lastDayOfWeek.getDate()+7)

    }

    const orders = await Order.find({
      date:{
        $gte:firstDayOfWeek,
        $lte:lastDayOfWeek
      },orderStatus:{$ne:'Returned'},cancelledOrder:false
    }).populate('userId')


    adminHelper.reportExcel(workbook,orders)
    
    const fileName = `weekly-sales-report${Date.now()}.xlsx`
    await workbook.xlsx.writeFile(fileName)
     
    res.setHeader('Content-Disposition',`attachment;filename=${fileName}`)
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    
    const fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);

    fileStream.on('close', () => {
      fs.unlinkSync(fileName);
    });


  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const loadMonthlySalesReport = async(req,res)=>{
  try{
    let year,month,startDate,endDate;

    if( req.query.selectedMonth)
    {
    
     const currentMonth = req.query.selectedMonth
     year = parseInt(currentMonth.substring(0,4),10)
     month =parseInt(currentMonth.substring(6),10)
     startDate = new Date(year,month-1,1)
     endDate = new Date(year,month,1)

    }else{

      const today = new Date()
      startDate = new Date(today.getFullYear(),today.getMonth(),1)
      endDate = new Date(startDate.getFullYear(),startDate.getMonth()+1,1)
     

    }

    const orders = await Order.find({
      date:{
        $gte:startDate,
        $lte:endDate
      },cancelledOrder:false,
      orderStatus:{$ne:'Returned'}
    }).populate('userId')


    res.render('monthlySales',{orders})

  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const downloadMonthlySalesReport = async(req,res)=>{
  try{
   
    let year,month,startDate,endDate;
    if( req.query.selectedMonth)
    {
    
     const currentMonth = req.query.selectedMonth
     year = parseInt(currentMonth.substring(0,4),10)
     month =parseInt(currentMonth.substring(6),10)
     startDate = new Date(year,month-1,1)
     endDate = new Date(year,month,1)

    }else{

      const today = new Date()
      startDate = new Date(today.getFullYear(),today.getMonth(),1)
      endDate = new Date(startDate.getFullYear(),startDate.getMonth()+1,1)
      

    }

    const orders = await Order.find({
      date:{
        $gte:startDate,
        $lte:endDate
      },cancelledOrder:false,
      orderStatus:{$ne:'Returned'}
    }).populate('userId')

    const doc = new PDFDocument({size:'A4',margin:50})
    adminHelper.salesPdf(orders,doc)
    doc.pipe(res)
    res.setHeader('Content-Disposition','attachment;filename="weekly-sales-report.pdf"')
    res.setHeader('Content-Type','application/pdf')
  }catch(error){
    console.log(error)
    res.render('404')
  }
}

const downloadMonthlySalesReportInExcel= async(req,res)=>{
  try{

    const workbook = new Excel.Workbook()
    let year,month,startDate,endDate;
    if( req.query.selectedMonth)
    {
    
     const currentMonth = req.query.selectedMonth
     year = parseInt(currentMonth.substring(0,4),10)
     month =parseInt(currentMonth.substring(6),10)
     startDate = new Date(year,month-1,1)
     endDate = new Date(year,month,1)

    }else{

      const today = new Date()
      startDate = new Date(today.getFullYear(),today.getMonth(),1)
      endDate = new Date(startDate.getFullYear(),startDate.getMonth()+1,1)
     

    }

    const orders = await Order.find({
      date:{
        $gte:startDate,
        $lte:endDate
      },cancelledOrder:false,
      orderStatus:{$ne:'Returned'}
    }).populate('userId')

    adminHelper.reportExcel(workbook,orders)
    
    const fileName = `monthly-sales-report${Date.now()}.xlsx`
    await workbook.xlsx.writeFile(fileName)
     
    res.setHeader('Content-Disposition',`attachment;filename=${fileName}`)
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    
    const fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);


    fileStream.on('close', () => {
      fs.unlinkSync(fileName);
    });

    
  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const loadYearlySalesReport = async(req,res)=>{

  try{

    let startOfYear,endOfYear;
    if(req.query.selectedYear)
       {
        if(req.query.selectedYear.length === 4){
           
          const selectedYear =parseInt(req.query.selectedYear,10)
           startOfYear = new Date(selectedYear,0,1)
           endOfYear = new Date(selectedYear,11,31)
          


        }else{
              return res.json('Please enter corrct year')
        }
       }else{
          const currentYear = new Date().getFullYear()
          startOfYear=new Date(currentYear,0,1)
          endOfYear=new Date(currentYear,11,31)

       }

       const orders = await Order.find({
        date:{
          $gte:startOfYear,
          $lte:endOfYear
        },
        cancelledOrder:false,
        orderStatus:{$ne:'Returned'}
       }).populate('userId')

    res.render('yearlySales',{orders})

  }catch(error){
    console.log(error.message);
    res.render('404')
  }

}

const downloadYearlySalesReport = async(req,res)=>{

  try{

    let startOfYear,endOfYear;
    if(req.query.selectedYear)
       {
        if(req.query.selectedYear.length === 4){
           
          const selectedYear =parseInt(req.query.selectedYear,10)
           startOfYear = new Date(selectedYear,0,1)
           endOfYear = new Date(selectedYear,11,31)
          


        }else{
              return res.json('Please enter corrct year')
        }
       }else{
          const currentYear = new Date().getFullYear()
          startOfYear=new Date(currentYear,0,1)
          endOfYear=new Date(currentYear,11,31)

       }

       const orders = await Order.find({
        date:{
          $gte:startOfYear,
          $lte:endOfYear
        },
        cancelledOrder:false,
        orderStatus:{$ne:'Returned'}
       }).populate('userId')

       const doc = new PDFDocument({size:"A4",margin:50})
       adminHelper.salesPdf(orders,doc)
       doc.pipe(res)
       res.setHeader('Content-Disposition','attachment;filename="yearly-sales-report.pdf"')
       res.setHeader('Content-Type','application/pdf')

    

  }catch(error){
    console.log(error.message);
    res.render('404')
  }
  
}

const downloadYearlySalesReportInExcel = async(req,res)=>{
  try{

      const workbook = new Excel.Workbook()
      let startOfYear,endOfYear;
    if(req.query.selectedYear)
       {
        if(req.query.selectedYear.length === 4){
           
          const selectedYear =parseInt(req.query.selectedYear,10)
           startOfYear = new Date(selectedYear,0,1)
           endOfYear = new Date(selectedYear,11,31)
          


        }else{
              return res.json('Please enter corrct year')
        }
       }else{
          const currentYear = new Date().getFullYear()
          startOfYear=new Date(currentYear,0,1)
          endOfYear=new Date(currentYear,11,31)

       }

       const orders = await Order.find({
        date:{
          $gte:startOfYear,
          $lte:endOfYear
        },
        cancelledOrder:false,
        orderStatus:{$ne:'Returned'}
       }).populate('userId')

       adminHelper.reportExcel(workbook,orders)

       const fileName =`yearly-sales-report-${Date.now()}.xlsx`
       await workbook.xlsx.writeFile(fileName)
     
    res.setHeader('Content-Disposition',`attachment;filename=${fileName}`)
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    
    const fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);

    fileStream.on('close', () => {
      fs.unlinkSync(fileName);
    });


  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const loadBannerManagement = async(req,res)=>{
  try{
    const banners = await Banner.find()

      res.render('bannerManagement',{banners})

  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const loadAddBanner = async(req,res)=>{

  try{
    

    res.render('addBanner')

  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const addBanner = async(req,res)=>{
  try{

     const imageFileName = req.file.filename

      const {name,description} = req.body

      const newBanner = new Banner({

        name:name,
        description:description,
        image:imageFileName
      })
      
      await newBanner.save()

      res.redirect('/admin/banner-management')


  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const loadEditBanner = async(req,res)=>{
  try{

      const bannerId = req.query.id
      const banner = await Banner.findOne({_id:bannerId})

      res.render('editBanner',{banner})

  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const editBanner = async(req,res)=>{
  try{
    let banner ;
    const {name,bannerId,description}=req.body
    if(req.file){
       banner = await Banner.findOneAndUpdate({_id:bannerId},{
        $set:{
             name:name,
             description:description,
             image:req.file.filename
             
        }
      })
    }
    else{
       banner = await Banner.findOneAndUpdate({_id:bannerId},{
        $set:{
             name:name,
             description:description,  
        }
      })
    }

    res.redirect(`/admin/edit-banner?id=${banner._id}`)
  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const blockBanner = async(req,res)=>{
  try{

    const bannerId = req.query.id
    console.log(bannerId);
    const banner = await Banner.findOneAndUpdate({_id:bannerId},{$set:{
      isActive:false
    }})

    res.redirect('/admin/banner-management')

  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const unBlockBanner=async(req,res)=>{

  try{

    const bannerId = req.query.id

    const banner = await Banner.findOneAndUpdate({_id:bannerId},{$set:{
      isActive:true
    }})

    res.redirect('/admin/banner-management')


  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const loadReferralOffer = async (req,res)=>{
  try{
    let msg =''
      if(req.query.msg){
        msg =req.query.msg
      }
    res.render('referralOffer',{message:msg})

  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}

const addReferralOffer = async(req,res)=>{

  try{

    const {offerValue} = req.body
    let referral = await Referral.findOne()
    console.log(referral);
    if(!referral){
      referral = new Referral({
        offerValue,
        referralCode:[]
      })
      await referral.save()
    }else{
      referral.offerValue = offerValue
      await referral.save()
    }

    res.redirect('/admin/add-referral-offer?msg=Offer added Successfully')

  }catch(error){
    console.log(error.message);
    res.render('404')
  }
}
module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  logout,
  forgetLoad,
  forgetVerify,
  forgetPasswordLoad,
  resetPassword,
  editLoad,
  updateProfile,
  adminDashboard,
  loadUsersDetails,
  userBlock,
  userUnblock,
  loadAdminProfile,
  loadOrders,
  loadOrderView,
  confirmOrder,
  orderDelivered,
  orderCancelAccept,
  orderReturnAccept,
  orderCancelRequest,
  returnOrderCancel,
  yearlySales,
  monthlySales,
  dailySales,
  downloadTotalSalesReport,
  loadTotalSalesReport,
  loadTodaySales,
  downloadTodaySales,
  loadWeeklySalesReport,
  downloadWeeklySalesReport,
  loadMonthlySalesReport,
  downloadMonthlySalesReport,
  loadYearlySalesReport,
  downloadYearlySalesReport,
  downloadTotalSalesReportInExcel,
  downloadTodaySalesReportInExcel,
  downloadWeeklySalesReportInExcel,
  downloadMonthlySalesReportInExcel,
  downloadYearlySalesReportInExcel,
  loadBannerManagement,
  loadAddBanner,
  addBanner,
  loadEditBanner,
  editBanner,
  blockBanner,
  unBlockBanner,
  loadReferralOffer,
  addReferralOffer
 
};
