/**
 * 
 * @description: export any service object to call in view(ejs) file
 * @returns any
 */

exports.toUpperFirstAll = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

exports.has_permission = (req, permissions, type = 'OR') => {
    let permissionslist = req.session.permissions;
    let hashPermission = false;
    for (let j = 0; j < permissions.length; j++) {
        const accessPermission = permissions[j];
        for (let i = 0; i < permissionslist.length; i++) {
            const element = permissionslist[i];
            if (element.name == accessPermission) {
                hashPermission = true;
                break;
            }
        }
        
    }
    return hashPermission;
};
