const Controller = require('./Controller');
module.exports = class home extends Controller {

    constructor() {
        super();
    }

    async index(Req, Res) {
        let data = {
            Request: Req
        }
        if (Req.session.user) {
            return Res.redirect(`/admin/`);
        }
    
        Res.render('pages/index', data);
    }
    dashboard(Req, Res) {
        let data = {
            Request: Req
        }
        Res.render('pages/dashboard', data);
    }
}


