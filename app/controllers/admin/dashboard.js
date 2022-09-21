const Controller = require('../Controller');
module.exports = class dashboard extends Controller {

    constructor() {
        super();
    }

    async index(Req, Res) {
        let data = {
            Request: Req
        }
        if (!Req.session.user) {
            return Res.redirect(`/admin/login`);
        }
        Res.render('admin/dashboard/dashboard', data);
    }
}


