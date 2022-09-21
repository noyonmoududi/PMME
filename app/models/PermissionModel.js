const Model = loadCore('model');

module.exports = class PermissionModel extends Model {
    constructor() {
        super();
        this.table = 'permissions';
        this.primaryKey = 'id';
    }
}
