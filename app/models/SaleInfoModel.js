const Model = loadCore('model');

module.exports = class SaleInfoModel extends Model {
    constructor() {
        super();
        this.table = 'sale_info';
        this.primaryKey = 'id';
    }
    async getInvoiceNumber() {
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
    async saveSaleInfoData(req_obj) {
        try {
            let insertData = await this.db(this.table).insert({ ...req_obj });
            let insertedId = insertData[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getSaleInfoByInvoiceNUm(invoiceNum) {
        try {
            let row = await this.db(this.table)
            .where(this.table+'.invoice_no',invoiceNum)
            .select().first();
            return row;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
