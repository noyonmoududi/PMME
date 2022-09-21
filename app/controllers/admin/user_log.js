const Controller = require('../Controller');
module.exports = class dashboard extends Controller {

    constructor() {
        super();
    }

    async logList(Req, Res) {

        try{
            let {page,search,sort,limit} = Req.query;
            limit =limit || 10;
            let page_no = (page)?parseInt(page):1;
            let offset = (page_no-1)*limit;
            offset = (offset<0)?0:offset;

            let ActivityLogModel = loadModel('ActivityLogModel');

            let query_builder = ActivityLogModel.db.from(ActivityLogModel.table);

            if(search) query_builder.where((query)=>{
                query.where(ActivityLogModel.table + '.log_name','like',`%${search}%`)
                query.orWhere(ActivityLogModel.table + '.description','like',`%${search}%`)
                query.orWhere(ActivityLogModel.table + '.ip_address','like',`%${search}%`)
            });
            if (sort) {
                if (sort == 1) query_builder.orderBy(ActivityLogModel.table + '.updated_at', 'asc')
                else if (sort == 4) query_builder.orderBy(ActivityLogModel.table + '.updated_at', 'desc')
                else query_builder.orderBy(ActivityLogModel.table + '.id', 'desc')
            } else query_builder.orderBy(ActivityLogModel.table + '.id', 'desc')

            let qb = query_builder.clone();
            let rows = await query_builder.limit(limit)
                        .offset(offset)
                       // .orderBy(ActivityLogModel.table+'.id','desc')
                        //.select(ActivityLogModel.db.raw('count('+ActivityLogModel.table+'.id) OVER() as total'))
                        .select([
                            ActivityLogModel.table+'.*'
                        ]);
            let total_rows = await qb.count(ActivityLogModel.table + ".id", { as: 'total' }).first();
            let search_panel = {
                active:true,
                limit:true,
                data: {
                    sort: {
                        1: 'Updated At - Ascending',
                        2: 'Updated At - Descending',
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
            let pagination = new Pagination(total,page_no,'/admin/logs/user',limit,Req.query);
            data.pagination = pagination.links();
            Res.render('admin/user-log/index', data);
        }catch(err){
            errorLog(Req,Res,err);
            console.log(err)
            Res.render('errors/500',{Request:Req});
        }
    }
}


