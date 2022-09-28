const Controller = loadCore('controller');;
module.exports = class customer extends Controller {

    constructor() {
        super();
    }
    async dueCustomerList(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        Res.render('admin/customers/customer_due_list',data);
    }
}
