exports.getContent = (item, layout_path, fields, route) => {
    let tbody = `
    `;
    for (let k in fields) {
        let field = fields[k];
        let field_name = field.split(":")[0];
        tbody += `                      <tr>
        `;
        tbody += `                      <th>${field_name.charAt(0).toUpperCase() + field_name.slice(1)}</th>
        `
        tbody += `                      <td><%- row.${field_name} %></td>
    `;
        tbody += `                      </tr>
    `;
    }
    tbody += `                      <tr>
                               <th>Created Time</th>
                               <td><%- row.created_at %></td>
                           </tr>`;

    return `<%- include('${layout_path}/header'); -%>
<div class="container">
    <div class="text-center mt-3">
        <h3 class="page-title text-center mt-3">${item} Details #<%-id%></h3>
        <a href="/${route}">View List</a>
    </div>
    <div class="row">
        <div class="col-12 text-right pb-3">
            <a class="btn btn-success btn-sm" href="/${route}/<%- row.id %>/edit">Edit</a>
            <form action="/${route}/<%- row.id %>/delete" method="POST" style="display: inline;">
                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure want to delete this?');">Delete</button>
            </form>
        </div>
        <div class="col-12 table-responsive">
            <table class="table table-bordered table-hover" id="areas">
                <%if(row){%>
                    <tbody>
                        ${tbody}
                    </tbody>
                <%}else{%>
                    <tr>
                        <th colspan="2">Item Not Found</th>
                    </tr>
                <%}%>
            </table>
        </div>
    </div>
</div>
<%- include('${layout_path}/footer'); -%>

    `
}
