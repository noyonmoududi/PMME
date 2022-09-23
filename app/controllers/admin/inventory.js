const Controller = loadCore('controller');;
module.exports = class inventory extends Controller {

    constructor() {
        super();
    }

    async productInventorySave(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        try {
           
            let req_data={};
            let RequestData = loadValidator(Req, Res);
            req_data = {
                identity_code: RequestData.post('identity_code', true, 'identity code').type('string').val(),
                product_id: RequestData.post('product_id', true, 'Product id').type('int').val(),
                quantity: RequestData.post('quantity', true, 'quantity').type('int').val(),
                created_by:Req.session.user.id,
                created_at:new Date(),
                updated_at:new Date(),
            };
           
                if (!RequestData.validate()) return false;
                let InventoryModel = loadModel('InventoryModel');
                let existProduct = await InventoryModel.saveInventory(req_data.identity_code);
                if (!existProduct) {
                    let inventorySave = await InventoryModel.saveInventory(req_data);      
                    await ActivityLogModel.saveLogData(Req,Res,'stock  has been added by',InventoryModel.table,inventorySave);
                    Req.session.flash_toastr_success = 'Product Stock Added successfully!';
                    Res.redirect(`/admin/products`);
                }else{
                    Req.session.flash_toastr_error = 'Product Identity Code Not found!.';
                    Res.redirect(`/admin/products/product-create`);
                }
           
        } catch (err) {
            errorLog(Req,Res,err);
            console.log(err);
            Req.session.flash_toastr_error = 'Something Went Wrong';
            return back(Req, Res);
        }
    }
}
