/** 
 * any kind of method you can export that will be injected in the app
 * @params err,req,res,next
 */
exports.request_middleware = require('../app/middleware/request')

exports.error_handler = (err, req, res, next) => {
    if (err.type == 'entity.too.large') ApiErrorResponse(res, 'TOO_LARGE_REQUEST_ENTITY');
    if (err.type == 'entity.parse.failed') ApiErrorResponse(res, 'INVALID_JSON_BODY');
    else {
        console.log('Catching the error from error handler in app injection dependencies:', err);
        errorLog(req,res,err);
        if (isApiCall(req)) return ApiErrorResponse(res, 'SOMETHING_WENT_WRONG');
        res.render('errors/common_error', { Request: req });
    }
}
