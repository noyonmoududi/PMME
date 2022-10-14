const Controller = loadCore('controller');;
module.exports = class customer extends Controller {

    constructor() {
        super();
    }
    async dueCustomerList(Req, Res) {
        try{
            let {page,search,sort,limit} = Req.query;
            limit =limit || 10;
            let page_no = (page)?parseInt(page):1;
            let offset = (page_no-1)*limit;
            offset = (offset<0)?0:offset;

            let CustomerDueModel = loadModel('CustomerDueModel');
            let CustomerModel = loadModel('CustomerModel');

            let query_builder = CustomerDueModel.db.from(CustomerDueModel.table)
             .leftJoin(CustomerModel.table,CustomerModel.table+'.id','=',CustomerDueModel.table+'.customer_id');

            if(search) query_builder.where((query)=>{
                search = search.trim()
                query.where(CustomerDueModel.table + '.invoice_no','like',`%${search}%`)
                query.orWhere(CustomerDueModel.table + '.invoice_amount','like',`%${search}%`)
                query.orWhere(CustomerModel.table + '.name','like',`%${search}%`)
                query.orWhere(CustomerModel.table + '.phone','like',`%${search}%`)
                query.orWhere(CustomerDueModel.table + '.due_amount','like',`%${search}%`)
                query.orWhere(CustomerDueModel.table + '.remaining_amount','like',`%${search}%`)
                query.orWhere(CustomerDueModel.table + '.installment_duration','like',`%${search}%`)
                query.orWhere(CustomerDueModel.table + '.installment_charge_percentage','like',`%${search}%`)
                query.orWhere(CustomerDueModel.table + '.installment_failed_charge_percentage','like',`%${search}%`)
                query.orWhere(CustomerDueModel.table + '.is_repayment_completed','like',`%${search}%`)
                query.orWhere(CustomerDueModel.table + '.last_updated_at','like',`%${search}%`)
            });
            if (sort) {
                if (sort == 1) query_builder.orderBy(CustomerDueModel.table + '.created_at', 'asc')
                else if (sort == 2) query_builder.orderBy(CustomerDueModel.table + '.created_at', 'desc')
                else if (sort == 3) query_builder.where(CustomerDueModel.table + '.remaining_amount', '>','0')
                else if (sort == 4) query_builder.where(CustomerDueModel.table + '.remaining_amount', '=','0')
                else query_builder.orderBy(CustomerDueModel.table + '.id', 'desc')
            } else query_builder.orderBy(CustomerDueModel.table + '.id', 'desc')

            let qb = query_builder.clone();

            let rows = await query_builder.limit(limit)
                        .offset(offset)
                        .select([
                            CustomerDueModel.table+'.*',
                            CustomerModel.table+'.name as customer_name',
                            CustomerModel.table+'.phone as customer_phone',
                        ]);
            let total_rows = await qb.count(CustomerDueModel.table + ".id", { as: 'total' }).first();
            let search_panel = {
                active:true,
                limit:true,
                data: {
                    sort: {
                        1: 'Created At - Ascending',
                        2: 'Created At - Descending',
                        3: 'Due Balance - Greater Than 0',
                        4: 'Due Balance - 0',
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
            let pagination = new Pagination(total,page_no,'/admin/customer-due',limit,Req.query);
            data.pagination = pagination.links();
            Res.render('admin/customers/customer_due_list', data);
        }catch(err){
            errorLog(Req,Res,err);
            console.log(err);
            Res.render('errors/common_error',{Request:Req});
        }
    }

    async customerInfoByMobile(Req, Res) {
        try {
            let mobile = Req.params["mobile"];
            let CustomerModel = loadModel('CustomerModel');
            let result = await CustomerModel.getCustomerInfoByPhone(mobile);
            if (result != 'undefined') {
                Res.send(result);
            }else{
                Res.send('error');
            }
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.send("error");
        }
    }
    async customernomineeInfoByMobile(Req, Res) {
        try {
            let mobile = Req.params["mobile"];
            let CustomerNomineeModel = loadModel('CustomerNomineeModel');
            let result = await CustomerNomineeModel.getCustomerNomineeInfoByPhone(mobile);
            if (result != 'undefined') {
                Res.send(result);
            }else{
                Res.send('error');
            }
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.send("error");
        }
    }
}
