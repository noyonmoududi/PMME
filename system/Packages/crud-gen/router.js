const geRouteContent = (route_name, controller_name, type = 'web') => {
    if (type == 'api') return `//${route_name}
route.get('/${route_name}',controller('${controller_name}/index'))
route.post('/${route_name}',controller('${controller_name}/store'))
route.post('/${route_name}/:id/update',controller('${controller_name}/update'))
route.get('/${route_name}/:id',controller('${controller_name}/show'))
route.post('/${route_name}/:id/delete',controller('${controller_name}/delete'))
`;
    return `//${route_name}
route.get('/${route_name}',controller('${controller_name}/index'))
route.get('/${route_name}/create',controller('${controller_name}/create'))
route.post('/${route_name}',controller('${controller_name}/store'))
route.get('/${route_name}/:id/edit',controller('${controller_name}/edit'))
route.post('/${route_name}/:id/edit',controller('${controller_name}/update'))
route.get('/${route_name}/:id',controller('${controller_name}/show'))
route.post('/${route_name}/:id/delete',controller('${controller_name}/destroy'))
`

}
exports.addRoutes = (route_name, controller_name, type = 'web') => {
    let file_name = type == 'web' ? 'web.js' : 'api.js';
    const fs = require('fs'),
        path = require('path'),
        content = geRouteContent(route_name, controller_name, type);
    fs.appendFile(path.join(__dirname, `../../../routes/${file_name}`), content, function (err) {
        if (err) throw err;
        let { colors } = require('../../artisan')
        console.log(`${colors.green}routes/${file_name} updated.${colors.reset}`)
    });
}