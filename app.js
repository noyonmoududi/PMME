require('./system/require');
// configure the app for post request data convert to json
app.use(express.urlencoded({ extended: false, limit: Config?.request_max_size || '10mb' }));
app.use(express.json({ limit: Config?.request_max_size || '10mb' }));
app.use(flash());

//view config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static(__dirname + "/public"));
// end view config

//injecting custom methods in the app
const injectable_methods = require('./dependencies/app.inject')
for (let key in injectable_methods) {
    app.use(injectable_methods[key])
}
app = require('./system/route-init')(app);

//exception handle
if (injectable_methods['error_handler']) app.use(injectable_methods.error_handler)
else {
    app.use(function (err, req, res, next) {
        if (err.type == 'entity.too.large') ApiErrorResponse(res, 'TOO_LARGE_REQUEST_ENTITY');
        if (err.type == 'entity.parse.failed') ApiErrorResponse(res, 'INVALID_JSON_BODY');
        else {
            console.log('Catching the error from error handler in app.js:', err)
            if (isApiCall(req)) return ApiErrorResponse(res, 'SOMETHING_WENT_WRONG');
            res.render('errors/500', { Request: req });
        }
    })
}

app.disable('x-powered-by');


exports.app = app;