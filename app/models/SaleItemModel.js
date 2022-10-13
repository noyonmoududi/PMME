const Model = loadCore('model');

module.exports = class SaleItemModel extends Model {
    constructor() {
        super();
        this.table = 'sale_item';
        this.primaryKey = 'id';
    }
    async saveSaleItemData(list_of_req_obj) {
        try {
            let insertData = await this.db(this.table).insert(list_of_req_obj);
            let insertedId = insertData[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getSaleItemsBySaleInfo(sale_info_id) {
        try {
            let ProductModel = loadModel('ProductModel');
            let rows = await this.db(this.table)
            .leftJoin(ProductModel.table,ProductModel.table+'.id','=',this.table+'.product_id')
            .where(this.table+'.sale_info_id',sale_info_id)
            .select([
                this.table+'.*',
                ProductModel.table+'.name as productName',
            ]);
            return rows;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
