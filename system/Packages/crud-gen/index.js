module.exports = (argv) => {
    const allowed = ['-fields', '-dir', '-layout', '--api']
    for (let comand of argv.slice(5, argv.length)) {
        if (comand[0] == '-' && !allowed.includes(comand)) throw '"' + comand + '" is not found in command list'
    }
    let name = argv[4];
    let fields, dir = "", layout = 'layout';
    let isApi = false;
    if (argv.indexOf('-fields') > 0) fields = argv[argv.indexOf('-fields') + 1];
    else throw '"-fields" is required';

    if (argv.indexOf('-dir') > 0) {
        dir = argv[argv.indexOf('-dir') + 1];
        if (!dir) throw "dir not provided";
        if (dir[0] == '/') dir = dir.substring(1, dir.length)
        if (dir[dir.length - 1] == '/') dir = dir.substring(0, dir.length - 1)
    }
    if (argv.indexOf('--api') > 0) isApi = true;
    if (argv.indexOf('-layout') > 0) {
        if (isApi) throw 'layout is not allowed in API CRUD';
        layout = argv[argv.indexOf('-layout') + 1];
        if (!layout) throw "layout not provided";
        if (layout[0] == '/') layout = layout.substring(1, layout.length)
        if (layout[layout.length - 1] == '/') layout = layout.substring(0, layout.length - 1)
    }

    try {
        fields = fields.split(",")
        let artisan = require('../../artisan')
        let Generator = artisan.Generator;
        let { pluralize } = require('../../utils')
        let table_name = pluralize(name)
        let route = table_name.replace(/_/g, '-')

        //generate migration
        console.log('Database Migration:')
        artisan.generate('migration', table_name, "", fields);

        //generate model
        console.log('Model:')
        let model = new Generator('model', name, dir, fields)
        model.execute();

        //generate controller
        console.log('Controller:')
        let controller = new Generator('controller', name, dir, fields)
        let controller_source_code = "";
        let model_path = model.file_name;
        let view_path = name;

        if (dir != "") {
            model_path = dir + "/" + model_path;
            model_path = model_path.replace(/\/\//g, '/');
            view_path = dir + "/" + view_path;
        }
        if (isApi) {
            let { apiControllerSourceCode } = require('./code-gen')
            controller_source_code = apiControllerSourceCode(name, model.file_name, model_path, fields)
        } else {
            let { webControllerSourceCode } = require('./code-gen')
            controller_source_code = webControllerSourceCode(name, view_path, model.file_name, model_path, fields, route)
        }
        controller.file_content = controller_source_code;
        controller.execute();

        //generate views
        if (!isApi) {
            console.log('Views Files:')
            let View = require('./view-gen');
            let view = new View(view_path, layout, name, fields, route);
            view.generate();
        }

        //update route
        console.log("Route:")
        let controller_path = name;
        if (dir != "") {
            controller_path = dir + "/" + controller_path;
            controller_path = controller_path.replace(/\/\//g, '/');
        }
        let router = require('./router');
        let type = isApi ? 'api' : 'web'
        router.addRoutes(route, controller_path, type)

    } catch (err) {
        console.log(err)
        throw 'Invalid field format';
    }
}