const Controller = loadCore('controller');;
module.exports = class report extends Controller {

    constructor() {
        super();
    }

    async saleSummary(Req, Res) {
        try {
            let data = {
                Request: Req,
                errors: Req.flash('errors')[0],
                old: Req.flash('old')[0]
            }
            data.page_title = 'Sale summary Report';
            Res.render('admin/report/sale_summary',data);
            
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.render('errors/common_error',{Request:Req});
        }
    }

    async saleSummaryDownload(Req, Res) {
        const fs = require('fs-extra');
         const other_obj = {};
         try {
             let RequestData = loadValidator(Req, Res);
             let fromDate = RequestData.post('from_date', true, 'From Date').type('string').val();
             let toDate = RequestData.post('from_date', true, 'To Date').type('string').val();
             var basePath = `./public/file_storage/`;
             var fullPath = `./public/file_storage/sale_summary/`;
             
           if (!RequestData.validate()) return false;
             // check if directory exists
             if (!fs.existsSync(basePath)) {
                 // if not create directory
                 fs.mkdirSync(basePath);
             }
             if (!fs.existsSync(fullPath)) {
             // if not create directory
                 fs.mkdirSync(fullPath);
             }
            //delete folder file
            await fs.emptyDir(fullPath);

            let SaleInfoModel = loadModel('SaleInfoModel');
            let CustomerDueCollectionModel = loadModel('CustomerDueCollectionModel');
            let saleInfo = await SaleInfoModel.getTodaySaleInfoByDate(fromDate,toDate);
            let dueCollection = await CustomerDueCollectionModel.getTodayDueCollectionSummary(fromDate,toDate);
            let totalDueCollection = dueCollection[0].today_due_collection;
            other_obj.total_due_coll= totalDueCollection;
            other_obj.fromDate= fromDate;
            other_obj.toDate= toDate;
            const { createReport } = loadLibrary('salesummaryreport');
            let fileName = fullPath +'sale_summary'+'.pdf';
            createReport(saleInfo, fileName, other_obj);
            Res.redirect(`/file_storage/sale_summary/sale_summary.pdf`);
         } catch (error) {
            console.log(error);
             errorLog(Req,Res,error);
             Req.session.flash_toastr_error = 'Something Went Wrong!.';
            return back(Req, Res);
         }
         
     }
}
