exports.getContent = (fields) => {
    fields_html = '';
    for(field of fields){
        let field_name = field.split(":")[0];
        fields_html +=`
        <div class="form-group">
            <labelf for="${field_name}">${field_name.charAt(0).toUpperCase() + field_name.slice(1)}</label>
            <input class="form-control" id="${field_name}" name="${field_name}" type="text" placeholder="Type ${field_name.charAt(0).toUpperCase() + field_name.slice(1)}"
                value="<%- (typeof old !='undefined')?old.${field_name}:''; %>">
            <small class="text-danger">
                <%= (typeof errors !='undefined' && errors.${field_name})?errors.${field_name}:''; %>
            </small>
        </div>
        `
    }
    return `
    <div class="row">
        <div class="col-md-6 offset-md-3">
            ${fields_html}
        </div>
    </div>
    `
}

