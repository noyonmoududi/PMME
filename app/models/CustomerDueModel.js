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

    async remainingAmountUpdate(req_obj) {
        try {
            let remianQty = await this.db(this.table).where({id:req_obj.id}).select(["remaining_amount"]).first();
            let calculationBalance = parseFloat(remianQty.remaining_amount-req_obj.amount);
            let update_obj = {
                remaining_amount : calculationBalance,
                last_updated_at: new Date(),
                last_updated_by: req_obj.user_id,
                is_repayment_completed: calculationBalance==0?'1':'0'
            }
            let updatedata = await this.db(this.table).where({id:req_obj.id}).update({ ...update_obj });
            return updatedata;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
