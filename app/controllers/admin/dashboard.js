const Controller = require('../Controller');
module.exports = class dashboard extends Controller {

    constructor() {
        super();
    }

    async index(Req, Res) {
        let data = {
            Request: Req
        }
        if (!Req.session.user) {
            return Res.redirect(`/admin/login`);
        }
        let SaleInfoModel = loadModel('SaleInfoModel');
        //getTodaySaleInfo
        let saleSummary = await SaleInfoModel.getTodaySaleInfoSummary();
console.log(saleSummary);
        Res.render('admin/dashboard/dashboard', data);
    }
}


