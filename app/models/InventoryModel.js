const Model = loadCore('model');

module.exports = class InventoryModel extends Model {
    constructor() {
        super();
        this.table = 'inventory';
        this.primaryKey = 'id';
    }

    async saveInventory(rec_obj) {
        try {
            let insertData = await this.db(this.table).insert({ ...rec_obj });
            let insertedId = insertData[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
