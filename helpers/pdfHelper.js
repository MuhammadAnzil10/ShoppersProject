

const generateHeader = (doc)=>{
    let logoPath ='public/images/userImages/man.png'
    doc
    .image(logoPath, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Shoppers Inc.", 110, 57)
    .fontSize(10)
    .text("Shoppers.", 200, 50, { align: "right" })
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("Kochi, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
}

const generateCustomerInformation = (doc,invoice)=>{

    doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(1234, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Payment Method:", 50, customerInformationTop + 30)
    .text(
      invoice.paymentMethod,
      150,
      customerInformationTop + 30
    )


    .font("Helvetica-Bold")
    .text(invoice.addressDetails.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.addressDetails.addressLine1, 300, customerInformationTop + 15)
    .text(
      invoice.addressDetails.addressLine2 +
        ", " +
        invoice.addressDetails.state +
        ", " +
        invoice.addressDetails.country + 
        ", "+
       "Pincode :" + invoice.addressDetails.postCode ,
       
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);

}


const generateInvoiceTable=(doc, invoice)=>{
    let i;
    const invoiceTableTop = 330;
  
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      invoiceTableTop,
      "Item",
      "Description",
      "Unit Cost",
      "Quantity",
      "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");
  
    for (i = 0; i < invoice.products.length; i++) {
      const item = invoice.products[i];
      console.log(item);
      const position = invoiceTableTop + (i + 1) * 30;

      generateTableRow(
        doc,
        position,
        item.productName,
        item.description,
        item.productPrice,                        //formatCurrency(item.productPrice / item.quantity),
        item.quantity,
        item.total                                            //formatCurrency(item.total)
      );
  
      generateHr(doc, position + 20);
    }
  
    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      subtotalPosition,
      "",
      "",
      "Discount",
      "",
      invoice.couponDiscount                            //formatCurrency(invoice.orderValue)
    );
  
    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
      doc,
      paidToDatePosition,
      "",
      "",
      // "Paid To Date",
      "",
      invoice.total                          // formatCurrency(invoice.total)
    );
  
    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      duePosition,
      "",
      "",
       "Grand Total",
      "",
      invoice.orderValue          // formatCurrency(invoice.total - invoice.total)
    );
    doc.font("Helvetica");
  }
  

  const  generateFooter=(doc)=>{
    doc
      .fontSize(10)
      .text(
        "Payment is due within 15 days. Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
      );
  }

  const generateTableRow=(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
  )=>{
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: "right" })
      .text(quantity, 370, y, { width: 90, align: "right" })
      .text(lineTotal, 0, y, { align: "right" });
  }

  const generateHr=(doc, y)=>{
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  const formatCurrency=(cents)=>{
    return "₹" + (cents / 100).toFixed(2);
  }

const formatDate=(date)=>{
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return year + "/" + month + "/" + day;
  }
  Date.now()

  module.exports = {
    generateHeader,
    generateCustomerInformation,
    generateInvoiceTable,
    generateFooter
  };