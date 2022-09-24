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
            let randomCode = random.generate(8);
            // let CategoryModel = loadModel('CategoryModel');
            // let BrandModel = loadModel('BrandModel');
            // let categories = await CategoryModel.getAllCategory();
            // let brands = await BrandModel.getAllBrands();
            // data.categoryData = categories;
            // data.brandData = brands;
            // data.identity_code = randomCode;
            data.page_title = 'Point Of Sale';
            Res.render('admin/sales/point_of_sale',data);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.render('errors/common_error',{Request:Req});
        }
    }
}
