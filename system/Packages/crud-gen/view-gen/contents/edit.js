exports.getContent = (item, layout_path, route) => {return `
<%- include('${layout_path}/header'); -%>
<div class="container">
    <div class="text-center mt-3">
        <h3 class="page-title">Update ${item} #<%-id%></h3>
        <a href="/${route}">View List</a>
    </div>
    <form action="/${route}/<%-id%>/edit" method="POST">
        <%- include('./form'); -%>
            <div class="text-center">
                <button type="submit" class="btn btn-success">Update</button>
            </div>
    </form>
</div>
<%- include('${layout_path}/footer'); -%>
`
}