const Controller = require('../../Controller');

module.exports = class dashboard extends Controller {

    constructor() {
        super();
    }

    async aclList(Req, Res) {

        try{
            let {page,search,sort,limit} = Req.query;
            limit =limit || 10;
            let page_no = (page)?parseInt(page):1;
            let offset = (page_no-1)*limit;
            offset = (offset<0)?0:offset;

            let UserModel = loadModel('UserModel');
            let query_builder = UserModel.db.from(UserModel.table);

            if(search) query_builder.where((query)=>{
                query.where(UserModel.table + '.name','like',`%${search}%`)
                query.orWhere(UserModel.table + '.email','like',`%${search}%`)
            });
            if (sort) {
                if (sort == 1) query_builder.orderBy(UserModel.table + '.name', 'asc')
                else if (sort == 2) query_builder.orderBy(UserModel.table + '.name', 'desc')
                else query_builder.orderBy(UserModel.table + '.id', 'desc')
            } else query_builder.orderBy(UserModel.table + '.id', 'desc')

            let qb = query_builder.clone();
            let rows = await query_builder.limit(limit)
                        .offset(offset)
                        //.orderBy(UserModel.table+'.id','asc')
                        //.select(UserModel.db.raw('count('+UserModel.table+'.id) OVER() as total'))
                        .select([
                            UserModel.table+'.*'
                        ]);
            let total_rows = await qb.count(UserModel.table + ".id", { as: 'total' }).first();
             rows = await rolsDataGenerate(rows);
            let search_panel = {
                active:true,
                limit:true,
                data: {
                    sort: {
                        1: 'Name - Ascending',
                        2: 'Name - Descending',
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
            let pagination = new Pagination(total,page_no,'/admin/settings/acl',limit,Req.query);
            data.pagination = pagination.links();
            Res.render('admin/acl/index', data);
        }catch(err){
            errorLog(Req,Res,err);
            console.log(err)
            Res.render('errors/500',{Request:Req});
        }
    }

    async aclCreate(Req, Res) {
        try {
            let data = {
                Request: Req,
                errors: Req.flash('errors')[0],
                old: Req.flash('old')[0]
            }
            let user_id = Req.query.id;
            let UserModel = loadModel('UserModel');
            let PermissionModel = loadModel('PermissionModel');
            let UserDirectPermissionModel = loadModel('UserDirectPermissionModel');
            let RoleModel = loadModel('RoleModel');
            let ModelHasRoleModel = loadModel('ModelHasRoleModel');
            let permissionData = await PermissionModel.db(PermissionModel.table).select().orderBy(PermissionModel.table + '.name', 'asc');
            let userData = await UserModel.db(UserModel.table).where({id:user_id}).select(['id','name','email']).first();
            let userDirectPermissionData = await UserDirectPermissionModel.db(UserDirectPermissionModel.table).where({user_id}).select();
            let assign_roles = await ModelHasRoleModel.db(ModelHasRoleModel.table)
            .leftJoin(RoleModel.table,RoleModel.table+'.id','=',ModelHasRoleModel.table+'.role_id')
            .where(ModelHasRoleModel.table+'.model_id',user_id).select([
                RoleModel.table+'.id as roleId',
                RoleModel.table+'.name as roleName'
            ]).select();
            let roles = await RoleModel.db(RoleModel.table).select();
            data.userData = userData;
            data.permissionData = permissionData;
            data.old=userDirectPermissionData;
            data.roles =roles;
            data.assign_roles=assign_roles;
            Res.render('admin/acl/create',data);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            return back(Req,Res);
        }
        
    }

    async assignAclPermission(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        try {
        let UserDirectPermissionModel = loadModel('UserDirectPermissionModel');
        let ModelHasRoleModel = loadModel('ModelHasRoleModel');
        let req_data=[];
        let req_data_role=[]
        let user_id = Req.params["id"];
        let RequestData = loadValidator(Req, Res);
        let roleIds = RequestData.post('roleCheckBox', false, 'Role').val();
        let permissionIds = RequestData.post('permission_id', false, 'Permission Name').val();
        if (!Array.isArray(permissionIds) && permissionIds) {
            let stringValue = permissionIds;
            permissionIds = [];
            permissionIds.push(stringValue);
            //permissionIds = Array.from(permissionIds);
        } 
        if (!Array.isArray(roleIds) && roleIds) {
            let stringValue = roleIds;
            roleIds = [];
            roleIds.push(stringValue);
            //roleIds = Array.from(roleIds);
        } 
        //if (!RequestData.validate()) return false;
        if (permissionIds && roleIds) { //If permission ids length is empty then delete all direct permission from table.
            req_data_role = roleIds.map((rowData) => ({
                role_id: parseInt(rowData),
                model_type:"App\User",
                model_id: parseInt(user_id),
            }));
            req_data = permissionIds.map((rowData2) => ({
                permission_id: parseInt(rowData2),
                user_id: parseInt(user_id),
            }));
            let deletePermission1 = await UserDirectPermissionModel.db(UserDirectPermissionModel.table).where({user_id}).delete();
            let deletePermission = await ModelHasRoleModel.db(ModelHasRoleModel.table).where({model_id:user_id}).delete();
            let savePermission1 = await ModelHasRoleModel.db(ModelHasRoleModel.table).insert(req_data_role);
            let savePermission = await UserDirectPermissionModel.db(UserDirectPermissionModel.table).insert(req_data);
            await ActivityLogModel.saveLogData(Req,Res,'Permissions Assagin by',ModelHasRoleModel.table,user_id);
            Req.session.flash_toastr_success = 'Permissions Assagin successfully!.';
            
        } else if (roleIds) {
            req_data_role = roleIds.map((rowData) => ({
                role_id: parseInt(rowData),
                model_type:"App\User",
                model_id: parseInt(user_id),
            }));
            let deletePermission1 = await UserDirectPermissionModel.db(UserDirectPermissionModel.table).where({user_id}).delete();
            let deletePermission = await ModelHasRoleModel.db(ModelHasRoleModel.table).where({model_id:user_id}).delete();
            let savePermission = await ModelHasRoleModel.db(ModelHasRoleModel.table).insert(req_data_role);
            await ActivityLogModel.saveLogData(Req,Res,'Permissions Assagin by',ModelHasRoleModel.table,user_id);
            Req.session.flash_toastr_success = 'Permissions Assagin successfully!.';
        } else if (permissionIds) {
            req_data = permissionIds.map((rowData) => ({
                permission_id: parseInt(rowData),
                user_id: parseInt(user_id),
                }));
                let deletePermission1 = await UserDirectPermissionModel.db(UserDirectPermissionModel.table).where({user_id}).delete();
                let deletePermission = await ModelHasRoleModel.db(ModelHasRoleModel.table).where({model_id:user_id}).delete();
            let savePermission = await UserDirectPermissionModel.db(UserDirectPermissionModel.table).insert(req_data);
            await ActivityLogModel.saveLogData(Req,Res,'Permissions Assagin by',UserDirectPermissionModel.table,user_id);
            Req.session.flash_toastr_success = 'Permissions Assagin successfully!.';
        }else {
            let deletePermission1 = await UserDirectPermissionModel.db(UserDirectPermissionModel.table).where({user_id}).delete();
            let deletePermission = await ModelHasRoleModel.db(ModelHasRoleModel.table).where({model_id:user_id}).delete();
            await ActivityLogModel.saveLogData(Req,Res,'Permissions Deleted by',ModelHasRoleModel.table,user_id);
            Req.session.flash_toastr_success = 'Permissions Delete successfully!.';
            //Req.session.flash_toastr_error = 'Value is required!.';
        }
        Res.redirect(`/admin/settings/acl`);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Req.session.flash_toastr_error = 'Something Went Wrong!.';
            return back(Req, Res);
        }
        
    }

    async userDirectPermissionCheck(Req, Res) {

        try {
            let data ={};
            let user_id = Req.params["id"];
            let PermissionModel = loadModel('PermissionModel');
            let UserDirectPermissionModel = loadModel('UserDirectPermissionModel');
            let result = await UserDirectPermissionModel.db(UserDirectPermissionModel.table)
            .leftJoin(PermissionModel.table,PermissionModel.table+'.id','=',UserDirectPermissionModel.table+'.permission_id')
            .where(UserDirectPermissionModel.table+'.user_id',user_id).select([
                UserDirectPermissionModel.table+'.*',
                PermissionModel.table+'.name as permission_name',
                PermissionModel.table+'.guard_name'
            ]);
            data.rolePermissions= await rolesPermissionData(user_id);
            data.directPermissions =result;
            Res.send(data);

        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            return back(Req,Res);
        }
        
    }
}

async function rolsDataGenerate(rows) {
    let RoleModel = loadModel('RoleModel');
    let ModelHasRoleModel = loadModel('ModelHasRoleModel');
    let uRows =[];
    for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    let roles = await ModelHasRoleModel.db(ModelHasRoleModel.table)
                    .leftJoin(RoleModel.table,RoleModel.table+'.id','=',ModelHasRoleModel.table+'.role_id')
                    .where(ModelHasRoleModel.table+'.model_id',element.id)
                    .select([
                        //ModelHasRoleModel.table+'.*',
                        //RoleModel.table+'.name as roleName',
                        RoleModel.db.raw(`(GROUP_CONCAT(${RoleModel.table}.name)) as roleName`)
                    ]).first();
    //const ret = roles.map((x) => x.roleName).join(', ');
    element.assign_roles =  roles.roleName;
    uRows.push(element);
    }

    return uRows;
}

async function rolesPermissionData(userId) {
    let RoleModel = loadModel('RoleModel');
    let RoleHasPermissionModel = loadModel('RoleHasPermissionModel');
    let PermissionModel = loadModel('PermissionModel');
    let ModelHasRoleModel = loadModel('ModelHasRoleModel');
    let permissionList = [];
    let roleList = await ModelHasRoleModel.db(ModelHasRoleModel.table)
    .leftJoin(RoleModel.table,RoleModel.table+'.id','=',ModelHasRoleModel.table+'.role_id')
    .where({model_id:userId}).select([ RoleModel.table+'.name as roleName', ModelHasRoleModel.table+'.role_id']);

        for (let i = 0; i < roleList.length; i++) {
            const element = roleList[i];
            let result = await RoleHasPermissionModel.db(RoleHasPermissionModel.table)
            .leftJoin(PermissionModel.table,PermissionModel.table+'.id','=',RoleHasPermissionModel.table+'.permission_id')
            .where(RoleHasPermissionModel.table+'.role_id',element.role_id).select([
                RoleHasPermissionModel.table+'.*',
                PermissionModel.table+'.name as permission_name',
                PermissionModel.table+'.guard_name'
            ]);
            if (result.length > 0 ) {
                permissionList.push(result);
            }
        }
    return permissionList;
}
