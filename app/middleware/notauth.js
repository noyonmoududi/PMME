module.exports = (req, response, next) => {
    if (req.session.user) {
        if (req.xhr) {
            return response.send({
                'error': 1,
                'error_code': 'ALREADY_LOGGED_IN',
                'message': 'You are already logged in.'
            });
        }
        return response.redirect('/dashboard');

    } else {
        next();
    }
};