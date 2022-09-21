const Model = loadCore('model');

module.exports = class VerifyUserModel extends Model {
    constructor() {
        super();
        this.table = 'verify_users';
        this.primaryKey = 'id';
    }
}
