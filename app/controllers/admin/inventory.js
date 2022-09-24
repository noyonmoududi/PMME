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
            let identity_code = Req.params["identity_code"];
            let product_id = Req.params["product_id"];
            req_data = {
                identity_code: identity_code,
                product_id: product_id,
                quantity: RequestData.post('quantity', true, 'quantity').type('int').val(),
                created_by:Req.session.user.id,
                created_at:new Date(),
                updated_at:new Date(),
            };
                if (!RequestData.validate()) return false;
                let InventoryModel = loadModel('InventoryModel');
                let ProductModel = loadModel('ProductModel');
                let existProduct = await ProductModel.getProductByCode(req_data.identity_code);
                if (existProduct) {
                    let inventorySave = await InventoryModel.saveInventory(req_data);      
                    await ActivityLogModel.saveLogData(Req,Res,'stock  has been added by',InventoryModel.table,inventorySave);
                    Res.send("SUCCESS");
                }else{
                    Res.send("ERROR");
                }
           
        } catch (err) {
            errorLog(Req,Res,err);
            console.log(err);
            Res.send("ERROR");
        }
    }
}
