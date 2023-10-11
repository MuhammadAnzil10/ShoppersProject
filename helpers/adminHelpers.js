const Admin = require('../models/adminModel')
const Order = require('../models/orderModel')
const PDFDocument = require('pdfkit')
const Excel = require('exceljs')





const getAdmin = ()=>{
    return new Promise(async(resolve,reject)=>{

        const adminData = await Admin.find();
        if(adminData){
            resolve(adminData)
        }else{
            reject(new Error)
        }
    })
}








const salesPdf =async (orders,doc)=>{


    doc.font('Helvetica-Bold')
    doc.fontSize(20).text('Total Sales Report - Order Summaries',{align:'center'})
    doc.moveDown()
    doc.font('Helvetica');
    doc.fontSize(12);

    let totalSales=0
    for(const order of orders){
     doc.text(`Order Id : ${order._id}`)
     doc.text(`Customer : ${order.userId.name}`)
     doc.text(`Date: ${order.date.toDateString()}`)
     doc.text(`Order Value :${order.orderValue}`)
     doc.text(`Payment Method : ${order.paymentMethod}`)
     doc
     doc.moveDown()
   totalSales+=order.orderValue
    }

    doc.moveDown()
    doc.text(`Total Sales : ${totalSales}`,{align:'right'})
    doc.end()


}





const reportExcel = async(workbook,orders)=>{

    
    const worksheet = workbook.addWorksheet('Total Sales Report')
    worksheet.addRow(['OrderId','date','User','Payment Method','Total'])
    let totalValue=0
    orders.forEach(order => {

        worksheet.addRow([order._id,order.date,order.userId.name,order.paymentMethod,order.orderValue])
        totalValue+=order.orderValue
        
    });
    worksheet.addRow([,,,,'Grand Total',totalValue])

    

}


module.exports={
    salesPdf,
    reportExcel,
    getAdmin
}