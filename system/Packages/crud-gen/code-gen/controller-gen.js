const sanitize = (str) => {
    str = str.replace(/-|_/g, ' ')
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
module.exports = (controller_name, view_path, model_name, model_path, fields, route) => {
    let field_data = '{';
    for (let field of fields) {
        let field_arr = field.split(":");
        if (field_data.includes('RequestData')) field_data += ','
        field_data += `
                    ${field_arr[0]}: RequestData.post('${field_arr[0]}', true, '${sanitize(field_arr[0])}').type('${field_arr[1] || 'string'}').val()`
    }
    field_data += `
                }`

    return `const Controller = loadCore('controller');;
module.exports = class ${controller_name} extends Controller {

    constructor() {
        super();
    }
    async index(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        let ${model_name} = loadModel('${model_path}');
        data.rows = await ${model_name}.get()
        data.sl = 1;
        Res.render('pages/${view_path}/index', data);
    }
    create(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        Res.render('pages/${view_path}/create', data);
    }
    async store(Req, Res) {
        try {
            let RequestData = loadValidator(Req, Res),
                insert_data = ${field_data}
            if (!RequestData.validate()) return false;

            let ${model_name} = loadModel('${model_path}');
            let insert_id = await ${model_name}.save(insert_data)

            Req.session.flash_success = 'Item has been stored.';
            return Res.redirect('/${route}');

        } catch (err) {
            console.log(err)
            Req.session.flash_fail = 'Something Went Wrong';
            Req.flash('old', Req.body);
            return back(Req, Res);
        }
    }
    async show(Req, Res) {
        let data = {
            Request: Req
        }
        let { id } = Req.params;
        let ${model_name} = loadModel('${model_path}');
        data.row = await ${model_name}.find({ id })
        if (!data.row) {
            Req.session.flash_fail = 'Item not found';
            return Res.redirect('/${route}');
        }
        data.id = id;
        Res.render('pages/${view_path}/show', data);
    }
    async edit(Req, Res) {
        let old = Req.flash('old')[0];
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
        }
        let { id } = Req.params;
        let ${model_name} = loadModel('${model_path}');
        data.old = old || await ${model_name}.find({ id })
        if (!data.old) {
            Req.session.flash_fail = 'Item not found';
            return Res.redirect('/${route}');
        }
        data.id = id;
        Res.render('pages/${view_path}/edit', data);
    }
    async update(Req, Res) {
        try {
            let { id } = Req.params;
            let RequestData = loadValidator(Req, Res),
                update_data = ${field_data}
            if (!RequestData.validate()) return false;

            let ${model_name} = loadModel('${model_path}');
            let updated_res = await ${model_name}.update({ id }, update_data)

            if (updated_res) Req.session.flash_success = 'Item has been updated.';
            else Req.session.flash_fail = 'Item not found';

            return Res.redirect('/${route}');
        } catch (err) {
            console.log(err)
            Req.session.flash_fail = 'Something Went Wrong';
            Req.flash('old', Req.body);
            return back(Req, Res);
        }
    }
    async destroy(Req, Res) {
        let { id } = Req.params;
        let ${model_name} = loadModel('${model_path}');
        let updated_res = await ${model_name}.delete({id})
        if (updated_res) Req.session.flash_success = 'Item has been deleted.';
        else Req.session.flash_fail = 'Item not found';
        return Res.redirect('/${route}');
    }

}

`;

}