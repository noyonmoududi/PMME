module.exports = (req, response, next) => {
    if (req.session.user) {
        next();
    } else {
        delete req.session.permissions;
        delete req.session.user;
        
        return response.redirect(`${req.baseUrl}/login`);
    }
};