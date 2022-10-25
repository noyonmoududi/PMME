const fs = require("fs");
const PDFDocument = require("pdfkit");

function createReport(saleInfoList, path,other_obj) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  generateHeader(doc);
  generateInvoiceTable(doc, saleInfoList,other_obj);
  generateFooter(doc);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("./public/file_storage/logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Matrichaya Electronic.", 110, 57)
    .fontSize(10)
    .text("Matrichaya Electronic.", 200, 50, { align: "right" })
    .text("Master Super Market,Pollimonal hut", 200, 65, { align: "right" })
    .text("Bogura,sadar,bogura-5800", 200, 80, { align: "right" })
    .moveDown();
}

function generateInvoiceTable(doc, saleInfoList,other_obj) {
    let totalCount = 0;
    let total_netamt=0;
    let total_down_payment = 0;
    let total_payment_amt = 0;
    let fromDate=other_obj.fromDate;
    let toDate=other_obj.toDate;
    
    doc.font("Helvetica-Bold");
  doc
  .fillColor("#444444")
  .fontSize(10)
  .text(`Sale Info From ${fromDate} to ${toDate}`, 50, 100);
   generateHr(doc, 120);
  let i;
  const invoiceTableTop = 130;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Invoice Num",
    "Invoice Date",
    "Total Item",
    "Invoice Amount",
    "Down Payment",
    "Payment Amount",
    "Customer Name",
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < saleInfoList.length; i++) {
    const item = saleInfoList[i];
    totalCount += item.invoice_item_count;
    total_netamt += item.net_amount;
    total_down_payment += item.down_payment;
   total_payment_amt += item.total_payment_amount;
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.invoice_no,
      item.invoice_date,
      item.invoice_item_count,
      item.net_amount,
      item.down_payment,
      item.total_payment_amount,
      item.customer_name,
    );

    generateHr(doc, position + 20);
  }

  const duePosition = invoiceTableTop +  (i + 1) * 30;
  generateTableRow(
    doc,
    duePosition,
    "Total",
    "",
    totalCount,
    total_netamt,
    total_down_payment,
    total_payment_amt
  );
  doc.font("Helvetica");

  const subtotalPosition = duePosition + 50;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    subtotalPosition,
    "Total Payment Amount",
    "",
    total_payment_amt
  );
  const paidToDatePosition = subtotalPosition + 20;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    paidToDatePosition,
    "Total Due Collection:",
    "",
    other_obj.total_due_coll
  );

  const duePosition2 = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition2,
    "Final Balance:",
    "",
    total_payment_amt+other_obj.total_due_coll
  );
//   doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(8)
    .text(
      "This is software generated Report, no signature required.",
      50,
      770,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  invoiceNum,
  InvoiceDate,
  invoiceItem,
  invoiceAmount,
  downpayment,
  paymentAmount,
  customerName
) {
  doc
    .fontSize(8)
    .text(invoiceNum, 50, y)
    .text(InvoiceDate, 135, y,{align: "left" })
    .text(invoiceItem, 160, y, { width: 90, align: "right" })
    .text(invoiceAmount, 225, y, { width: 90, align: "right" })
    .text(downpayment, 320, y,{ width: 60, align: "right" })
    .text(paymentAmount, 390, y,{ width: 70, align: "right" })
    .text(customerName, 470, y,{ width: 70, align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createReport
};
