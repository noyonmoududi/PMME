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
    async getTodaySaleInfoSummary(fromDate, todate) {
        try {
            let row = await  this.db.raw(`SELECT 
            IFNULL(SUM(invoice_item_count), 0) AS sale_item_count,
            IFNULL(SUM(net_amount),0) AS total_net_amt, 
            IFNULL(SUM(total_payment_amount),0) AS total_payment_amt, 
            IFNULL((SUM(net_amount)- SUM(total_payment_amount)),0) AS total_due_amount
            FROM ${this.table}
            WHERE DATE(invoice_date) BETWEEN '${fromDate}' AND '${todate}'`)
            return row[0];
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getTodaySaleInfoByDate(fromDate, todate) {
        let CustomerModel = loadModel('CustomerModel');
        try {
            let row = await  this.db.raw(`SELECT *, ${CustomerModel.table}.name AS customer_name
                                            FROM ${this.table}
                                            LEFT  JOIN ${CustomerModel.table} ON ${this.table}.customer_id=${CustomerModel.table}.id
                                            WHERE DATE(${this.table}.invoice_date) BETWEEN '${fromDate}' AND  '${todate}';`)
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
