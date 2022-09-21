exports.getContent = (item, layout_path, fields, route) => {
    let headers = `<th>SL</th>
                        `;
    let rows = `<td><%- sl++ %></td>
                        `;
    for (let k in fields) {
        if(k>5) break;
        let field = fields[k];
        let field_name = field.split(":")[0];
        headers += `<th>${field_name.charAt(0).toUpperCase() + field_name.slice(1)}</th>
                        `
        rows += `   <td><%- row.${field_name} %></td>
                        `
    }
    headers += '<th>Actions</th>'
    rows += `   <td>
                                <a href="/${route}/<%- row.id %>" class="btn btn-sm btn-primary">Show</a>
                                <a href="/${route}/<%- row.id %>/edit" class="btn btn-sm btn-primary">Edit</a>
                                <form action="/${route}/<%- row.id %>/delete" method="POST" style="display: inline;">
                                    <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure want to delete this?');">Delete</button>
                                </form>
                            </td>`;

    return `<%- include('${layout_path}/header'); -%>
<div class="container">
    <h3 class="page-title text-center mt-3">${item} List</h3>
    <div class="row">
        <div class="col-12 text-right pb-3">
            <a href="/${route}/create" class="btn btn-sm btn-success">Create New</a>
        </div>
        <div class="col-12 table-responsive">
            <table class="table table-bordered table-hover" id="areas">
                <thead >
                    <tr>
                        ${headers}
                    </tr>
                </thead>
                <tbody>
                    <% if(rows.length > 0) { 
                        rows.forEach(row=>{%>
                        <tr>
                            ${rows}
                        </tr>
                        
                    <% }) }else{%>
                        <tr>
                            <td colspan="5" class="text-center">No Data Found!</td>
                        </tr>
                    <% }%>
                        
                </tbody>
            </table>
        </div>
    </div>
</div>
<%- include('${layout_path}/footer'); -%>
    `
}


