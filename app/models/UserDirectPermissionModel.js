const Model = loadCore('model');

module.exports = class UserDirectPermissionModel extends Model {
    constructor() {
        super();
        this.table = 'user_direct_permissions';
    }
}
