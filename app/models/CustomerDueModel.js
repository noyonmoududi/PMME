const Model = loadCore('model');

module.exports = class CustomerDueModel extends Model {
    constructor() {
        super();
        this.table = 'customers_due';
        this.primaryKey = 'id';
    }
    async saveCustomerDueData(req_obj) {
        try {
            let insertData = await this.db(this.table).insert({ ...req_obj });
            let insertedId = insertData[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getDueInfoBySaleId(sale_info_id) {
        try {
            let result = await this.db(this.table).where({sale_info_id}).select().first();
            return result;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getDueInfoByInvoice(invoice_no) {
        try {
            let result = await this.db(this.table).where({invoice_no}).select().first();
            return result;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
