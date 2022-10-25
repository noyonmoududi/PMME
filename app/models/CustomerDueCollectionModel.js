const Model = loadCore('model');

module.exports = class CustomerDueCollectionModel extends Model {
    constructor() {
        super();
        this.table = 'customers_due_collections';
        this.primaryKey = 'id';
    }

    async dueCollectionAmountSave(req_obj) {
        try {
            let insertData = await this.db(this.table).insert({ ...req_obj });
            let insertedId = insertData[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getDueCollectionDetailsByDueId(customer_due_id) {
        try {
            let UserModel = loadModel('UserModel');
            let result = await this.db(this.table)
            .leftJoin(UserModel.table,UserModel.table+'.id','=',this.table+'.created_by')
            .where(this.table+'.customer_due_id',customer_due_id)
            .select([
                this.table+'.*',
                UserModel.table+'.name as created_by_name',
            ]);
            return result;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async getTodayDueCollectionSummary(fromDate, todate) {
        try {
            let row = await  this.db.raw(`SELECT 
            IFNULL(SUM(amount), 0) AS today_due_collection
            FROM ${this.table}
            WHERE DATE(created_at) BETWEEN '${fromDate}' AND '${todate}'`)
            return row[0];
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
