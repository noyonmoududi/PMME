/**
 * 
 * @param {Request} Req 
 * @param {Session Key} key 
 * @returns data
 */
exports.get_session = (Req, key) => {
    let data = Req.session[key];
    return data;
};

/**
 * 
 * @param {Request} Req 
 * @param {Session Key} key 
 * @returns data
 */
exports.get_flash = (Req, key) => {
    let data = Req.session[key];
    delete Req.session[key];
    return data;
};