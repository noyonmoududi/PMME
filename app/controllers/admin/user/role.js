const Controller = require('../../Controller');

module.exports = class RoleModel extends Controller {

    constructor() {
        super();
    }

    async roleList(Req, Res) {

        try{
            let {page,search,sort,limit} = Req.query;
            limit =limit || 10;
            let page_no = (page)?parseInt(page):1;
            let offset = (page_no-1)*limit;
            offset = (offset<0)?0:offset;

            let RoleModel = loadModel('RoleModel');

            let query_builder = RoleModel.db.from(RoleModel.table);

            if(search) query_builder.where((query)=>{
                query.where(RoleModel.table + '.name','like',`%${search}%`)
                query.orWhere(RoleModel.table + '.guard_name','like',`%${search}%`)
            });
            if (sort) {
                if (sort == 1) query_builder.orderBy(RoleModel.table + '.name', 'asc')
                else if (sort == 2) query_builder.orderBy(RoleModel.table + '.name', 'desc')
                else if (sort == 3) query_builder.orderBy(RoleModel.table + '.updated_at', 'asc')
                else if (sort == 4) query_builder.orderBy(RoleModel.table + '.updated_at', 'desc')
                else query_builder.orderBy(RoleModel.table + '.id', 'desc')
            } else query_builder.orderBy(RoleModel.table + '.id', 'desc')

            let qb = query_builder.clone();
            let rows = await query_builder.limit(limit)
                        .offset(offset)
                       //.orderBy(RoleModel.table+'.id','desc')
                        //.select(RoleModel.db.raw('count('+RoleModel.table+'.id) OVER() as total'))
                        .select([
                            RoleModel.table+'.*'
                        ]);
            let total_rows = await qb.count(RoleModel.table + ".id", { as: 'total' }).first();
            let search_panel = {
                active:true,
                limit:true,
                data: {
                    sort: {
                        1: 'Name - Ascending',
                        2: 'Name - Descending',
                        3: 'Updated At - Ascending',
                        4: 'Updated At - Descending',
                    }
                }
            }
            let data = {
                Request : Req,
                rows,
                sl:offset+1,
                search_panel
            }
            let total = total_rows.total || 0;
            let Pagination = loadLibrary('pagination');
            let pagination = new Pagination(total,page_no,'/admin/settings/roles',limit,Req.query);
            data.pagination = pagination.links();
            Res.render('admin/role/index', data);
        }catch(err){
            errorLog(Req,Res,err);
            console.log(err)
            Res.render('errors/500',{Request:Req});
        }
    }
    async roleCreate(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        data.page_title = 'Create Role';
        Res.render('admin/role/role_create',data);
    }

    async roleEdit(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        data.page_title = 'Edit Role';
        let id = Req.params["id"];
        let RoleModel = loadModel('RoleModel');
        let roleData = await RoleModel.db(RoleModel.table).where(RoleModel.table+'.id',id).select().first();
        data.old = roleData;
        Res.render('admin/role/role_create',data);
    }
    async roleDelete(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        try {
            let id = Req.params["id"];
            let RoleModel = loadModel('RoleModel');
            let RoleHasPermissionModel = loadModel('RoleHasPermissionModel');
            let ModelHasRoleModel = loadModel('ModelHasRoleModel');
            let deleteUserRole = await ModelHasRoleModel.db(ModelHasRoleModel.table).where(ModelHasRoleModel.table+'.role_id',id).delete();
            let deleteRolepermission = await RoleHasPermissionModel.db(RoleHasPermissionModel.table).where(RoleHasPermissionModel.table+'.role_id',id).delete();
            let deleteRole = await RoleModel.db(RoleModel.table).where(RoleModel.table+'.id',id).delete();
            await ActivityLogModel.saveLogData(Req,Res,'Role has been deleted by',RoleModel.table,id);
            Req.session.flash_toastr_success = 'Role Delete successfully!';
            Res.redirect(`/admin/settings/roles`);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error)
            Req.session.flash_toastr_error = 'Something Went Wrong';
            return back(Req, Res);
        }
       
    }
    async roleSaveOrUpdate(Req,Res){
        let ActivityLogModel = loadModel('ActivityLogModel');
        try {
            let RequestData = loadValidator(Req, Res);
            let hiddenid = RequestData.post('hidden_role_id', false, 'ID').val();
            let req_data = {
                name: RequestData.post('name', true, 'Name').val(),
                guard_name:'web',
            };

            if (!RequestData.validate()) return false;
             let RoleModel = loadModel('RoleModel');
            let existRow = await RoleModel.db(RoleModel.table).where({name:req_data.name}).first();
            if (typeof(existRow) == "undefined" || existRow.id ==hiddenid ){
                if (hiddenid) {
                    req_data.updated_at=new Date();
                    let roleUpdate = await RoleModel.db(RoleModel.table).where({id:hiddenid}).update({...req_data}); 
                    await ActivityLogModel.saveLogData(Req,Res,'Role has been updated by',RoleModel.table,hiddenid);
                    Req.session.flash_toastr_success = 'Role Updated successfully!';
                } else {
                    req_data.updated_at=new Date();
                    req_data.created_at=new Date();
                    let roleSave = await RoleModel.db(RoleModel.table).insert({...req_data}); 
                    await ActivityLogModel.saveLogData(Req,Res,'Role has been created by',RoleModel.table,roleSave);
                    Req.session.flash_toastr_success = 'Role Created successfully!';
                }
                
            } else{
                if (existRow.name == req_data.name) {
                    Req.session.flash_toastr_error = 'Role Name already Exist!.';
                }
                return back(Req, Res);
            }            

            // return back(Req, Res);
            Res.redirect(`/admin/settings/roles`);

        } catch (err) {
            errorLog(Req,Res,err);
            console.log(err)
            Req.session.flash_toastr_error = 'Something Went Wrong';
            return back(Req, Res);
        }
    }

    async rolePermission(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        let role_id = Req.query.role_id;
        let RoleModel = loadModel('RoleModel');
        let PermissionModel = loadModel('PermissionModel');
        let RoleHasPermissionModel = loadModel('RoleHasPermissionModel');
        let permissionData = await PermissionModel.db(PermissionModel.table).select().orderBy(PermissionModel.table + '.name', 'asc');
        let roleData = await RoleModel.db(RoleModel.table).where({id:role_id}).first();
        let roleHasPermissionData = await RoleHasPermissionModel.db(RoleHasPermissionModel.table).where({role_id}).select();
        data.roleData = roleData;
        data.permissionData = permissionData;
        data.old=roleHasPermissionData;

        Res.render('admin/role/permission',data);
    }

    async assignPermission(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        try {
        let req_data=[]
        let role_id = Req.params["role_id"];
        let RequestData = loadValidator(Req, Res);
        let permissionIds = RequestData.post('permission_id', false, 'Permission Name').val();
        if (!Array.isArray(permissionIds) && permissionIds) {
            let stringValue = permissionIds;
            permissionIds = [];
            permissionIds.push(stringValue);
           // permissionIds = Array.from(permissionIds);
        } 
        if (!RequestData.validate()) return false;
        if (permissionIds) {
            req_data = permissionIds.map((rowData) => ({
                permission_id: parseInt(rowData),
                role_id: parseInt(role_id),
                }));
            let RoleHasPermissionModel = loadModel('RoleHasPermissionModel');
            let deletePermission = await RoleHasPermissionModel.db(RoleHasPermissionModel.table).where({role_id}).delete();
            let savePermission = await RoleHasPermissionModel.db(RoleHasPermissionModel.table).insert(req_data);
            await ActivityLogModel.saveLogData(Req,Res,'Role wise Permission assagin by',RoleHasPermissionModel.table,role_id);
            Req.session.flash_toastr_success = 'Permissions Assagin successfully!.';
        } else {
            let RoleHasPermissionModel = loadModel('RoleHasPermissionModel');
            let deletePermission = await RoleHasPermissionModel.db(RoleHasPermissionModel.table).where({role_id}).delete();
            await ActivityLogModel.saveLogData(Req,Res,'Role wise Permission deleted by',RoleHasPermissionModel.table,role_id);
            Req.session.flash_toastr_success = 'Permissions Deleted successfully!.';
        }
        Res.redirect(`/admin/settings/roles`);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Req.session.flash_toastr_error = 'Something Went Wrong!.';
            return back(Req, Res);
        }
        
    }

    async rolePermissionCheck(Req, Res) {
        let role_id = Req.params["role_id"];
        let PermissionModel = loadModel('PermissionModel');
        let RoleHasPermissionModel = loadModel('RoleHasPermissionModel');
        
        let result = await RoleHasPermissionModel.db(RoleHasPermissionModel.table)
        .leftJoin(PermissionModel.table,PermissionModel.table+'.id','=',RoleHasPermissionModel.table+'.permission_id')
        .where(RoleHasPermissionModel.table+'.role_id',role_id).select([
            RoleHasPermissionModel.table+'.*',
            PermissionModel.table+'.name as permission_name',
            PermissionModel.table+'.guard_name'
        ]);
        Res.send(result);
    }
}


