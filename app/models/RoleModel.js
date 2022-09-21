const Model = loadCore('model');

module.exports = class RoleModel extends Model {
    constructor() {
        super();
        this.table = 'roles';
        this.primaryKey = 'id';
    }
}
