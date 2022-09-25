const Model = loadCore('model');

module.exports = class ProductModel extends Model {
    constructor() {
        super();
        this.table = 'products';
        this.primaryKey = 'id';
    }

    async saveProduct(rec_obj) {
        try {
            let insertData = await this.db(this.table).insert({ ...rec_obj });
            let insertedId = insertData[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async getProductByCode(identity_code) {
        try {
            let row = await this.db(this.table)
            .where(this.table+'.identity_code',identity_code)
            .select().first();
            return row;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async getProductByProductId(product_id) {
        let BrandModel = loadModel('BrandModel');
        let CategoryModel = loadModel('CategoryModel');
        try {
            let row = await this.db(this.table)
            .leftJoin(BrandModel.table,BrandModel.table+'.id','=',this.table+'.brand_id')
            .leftJoin(CategoryModel.table,CategoryModel.table+'.id','=',this.table+'.category_id')
            .where(this.table+'.id',product_id)
            .select([
                this.table+'.*',
                BrandModel.table+'.name as brand_name',
                CategoryModel.table+'.name as category_name',
            ]).first();
            return row;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async updateProduct(req_data) {
        try {
            let updateItem = await this.db(this.table).where({id:req_data.id,identity_code:req_data.identity_code}).update({ ...req_data });
            let updatedId = updateItem[0];
            return updatedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async getProductStockByCode(identity_code) {
        let InventoryModel = loadModel('InventoryModel');
        let SaleItemModel = loadModel('SaleItemModel');
        try {
            let row = await this.db(this.table)
            .where(this.table+'.identity_code',identity_code)
            .select(
                this.table+'.*',
                this.db.raw(`IFNULL((SELECT SUM(${InventoryModel.table}.quantity) FROM ${InventoryModel.table} WHERE(${InventoryModel.table}.product_id = ${this.table}.id)),0) AS total_inventory`),
                this.db.raw(`IFNULL((SELECT SUM(${SaleItemModel.table}.quantity) FROM ${SaleItemModel.table} WHERE(${SaleItemModel.table}.product_id = ${this.table}.id)),0) AS total_sale`),
                this.db.raw(`(IFNULL((SELECT SUM(${InventoryModel.table}.quantity) FROM ${InventoryModel.table} WHERE(${InventoryModel.table}.product_id = ${this.table}.id)),0) - IFNULL((SELECT SUM(${SaleItemModel.table}.quantity) FROM ${SaleItemModel.table} WHERE(${SaleItemModel.table}.product_id = ${this.table}.id)),0)) as current_stock`),
            ).first();
            return row;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

}
