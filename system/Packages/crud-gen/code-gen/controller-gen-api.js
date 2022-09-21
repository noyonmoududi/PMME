const sanitize = (str) => {
    str = str.replace(/-|_/g, ' ')
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
module.exports = (controller_name, model_name, model_path, fields) => {
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
        try {
            let ${model_name} = loadModel('${model_path}'),
                rows = await ${model_name}.get();
            return ApiResponse(Res, rows)
        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async store(Req, Res) {
        try {
            let RequestData = loadValidator(Req, Res),
                insert_data = ${field_data}
            if (!RequestData.validate()) return false;

            let ${model_name} = loadModel('${model_path}');
            let insert_id = await ${model_name}.save(insert_data)

            return ApiResponse(Res, { message: 'SUCCESS', id: insert_id })

        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async show(Req, Res) {
        try {
            let { id } = Req.params;
            let ${model_name} = loadModel('${model_path}');
            let row = await ${model_name}.find({ id })
            if (row) return ApiResponse(Res, row)
            else return ApiResponse(Res, {})
        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async update(Req, Res) {
        try {
            let { id } = Req.params;
            let RequestData = loadValidator(Req, Res),
                update_data = ${field_data}
            if (!RequestData.validate()) return false;

            let ${model_name} = loadModel('${model_path}');
            let updated_res = await ${model_name}.update({ id }, update_data)

            if (updated_res) return ApiResponse(Res, { message: 'SUCCESS', id })
            else ApiErrorResponse(Res, 'DATA_NOT_FOUND');
        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async delete(Req, Res) {
        try {
            let { id } = Req.params;
            let ${model_name} = loadModel('${model_path}');
            let res = await ${model_name}.delete({id})
            if (res) return ApiResponse(Res, { message: 'SUCCESS', id })
            else ApiErrorResponse(Res, 'DATA_NOT_FOUND');
        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }

}

`;

}