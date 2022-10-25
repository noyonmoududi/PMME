const Controller = require('../Controller');
module.exports = class dashboard extends Controller {

    constructor() {
        super();
    }

    async index(Req, Res) {
        try {
            let data = {
                Request: Req
            }
            if (!Req.session.user) {
                return Res.redirect(`/admin/login`);
            }
            let SaleInfoModel = loadModel('SaleInfoModel');
            let CustomerDueCollectionModel = loadModel('CustomerDueCollectionModel');
            let currentDateTime = new Date();
            var currentDate = currentDateTime.toISOString().split('T')[0];
            let saleSummary = await SaleInfoModel.getTodaySaleInfoSummary(currentDate,currentDate);
            let dueCollectionSummary = await CustomerDueCollectionModel.getTodayDueCollectionSummary(currentDate,currentDate);
            data.saleSummary=saleSummary[0];
            data.dueCollectionSummary=dueCollectionSummary[0];
            Res.render('admin/dashboard/dashboard', data);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.render('errors/common_error',{Request:Req});
        }
        
    }
}


