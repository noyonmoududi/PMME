module.exports = async function (req, res, next) {
    try {
        let log_path = await loadSystem('logger').requestlog(req);
    }
    catch (err) {
        console.log(err)
    }
    next();
};
