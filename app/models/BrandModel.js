const Model = loadCore('model');

module.exports = class BrandModel extends Model {
    constructor() {
        super();
        this.table = 'brands';
        this.primaryKey = 'id';
    }

    async getAllBrands() {
        try {
            let rows =await this.db(this.table).where({status:1}).select();
            return rows;
        }
        catch (error) {
            return Promise.reject(error);
        }
    } 
}
