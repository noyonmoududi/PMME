const CoreController = loadCore('controller');

module.exports = class Controller extends CoreController {
    constructor() {
        super();
        this.data = {
            'page_title': 'NodeJs-MVC'
        };

    }
    notFound(Req, Res) {
        if (Req.xhr || Req.originalUrl.includes('/api/')) {
            Res.send({
                'error': 1,
                'error_code': 'NOT_FOUND',
                'message': 'The requested URL/Page was not found'
            }); return;
        }
        return Res.render('errors/404');
    }
}