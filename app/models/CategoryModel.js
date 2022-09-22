const Model = loadCore('model');

module.exports = class CategoryModel extends Model {
    constructor() {
        super();
        this.table = 'categories';
        this.primaryKey = 'id';
    }

    async getAllCategory() {
        try {
            let rows =await this.db(this.table).where({status:1}).select();
            return rows;
        }
        catch (error) {
            return Promise.reject(error);
        }
    } 
}
