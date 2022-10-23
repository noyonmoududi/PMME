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
    async getTodaySaleInfoSummary() {
        try {
            const from = '2022-10-03';
            const to = '2022-10-14';
            let row = await  this.db.raw(`SELECT 
            SUM(invoice_item_count) AS sale_item_count,
            SUM(net_amount) AS total_net_amt, 
            SUM(total_payment_amount) AS total_payment_amt, 
            (SUM(net_amount)- SUM(total_payment_amount)) AS total_due_amount
            FROM sale_info
            WHERE DATE(invoice_date) BETWEEN '2022-10-03' AND '2022-10-03'`)
            return row[0];
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
