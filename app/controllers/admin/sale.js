const Controller = loadCore('controller');;
module.exports = class sale extends Controller {

    constructor() {
        super();
    }
    async pointOfSale(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        try {
            let random = require("randomstring");
            let randomCode = random.generate(4);
            var currentDateTime = new Date();
            let invoiceNum = currentDateTime.getFullYear() + ''+(currentDateTime.getMonth() + 1)+''+currentDateTime.getDate()+''+currentDateTime.getHours()+''+currentDateTime.getMinutes()+''+currentDateTime.getSeconds()+''+randomCode.toUpperCase();
            let PaymentTypeModel = loadModel('PaymentTypeModel');
            let payments = await PaymentTypeModel.getAllpayment();
            data.paymentData = payments;
            data.invoiceNo = invoiceNum;
            data.page_title = 'Point Of Sale';
            Res.render('admin/sales/point_of_sale',data);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.render('errors/common_error',{Request:Req});
        }
    }
}
