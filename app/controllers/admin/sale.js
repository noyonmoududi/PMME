const Controller = loadCore('controller');;
module.exports = class sale extends Controller {

    constructor() {
        super();
    }
    async pointOfSale(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        try {
            let random = require("randomstring");
            let randomCode = random.generate(4);
            var currentDateTime = new Date();
            let invoiceNum = currentDateTime.getFullYear() + ''+(currentDateTime.getMonth() + 1)+''+currentDateTime.getDate()+''+currentDateTime.getHours()+''+currentDateTime.getMinutes()+''+currentDateTime.getSeconds()+''+randomCode.toUpperCase();
            let PaymentTypeModel = loadModel('PaymentTypeModel');
            let payments = await PaymentTypeModel.getAllpayment();
            data.paymentData = payments;
            data.invoiceNo = invoiceNum;
            data.page_title = 'Point Of Sale';
            Res.render('admin/sales/point_of_sale',data);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.render('errors/common_error',{Request:Req});
        }
    }

    async getProductDetailsWithStock(Req, Res) {
        try {
            let identity_code = Req.params["identity_code"];
            let ProductModel = loadModel('ProductModel');
            let result = await ProductModel.getProductStockByCode(identity_code);
            if (result != 'undefined') {
                if (result.current_stock > 0 ) {
                    Res.send(result);
                } else {
                    Res.send('NOSTOCK');
                }
            }else{
                Res.send('error');
            }
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.send("error");
        }
       
    }

    async saveSaleData(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        Res.redirect(`/admin/point-of-sale`);
    }

    async saleInfoList(Req, Res) {
        try{
            let {page,search,sort,limit} = Req.query;
            limit =limit || 10;
            let page_no = (page)?parseInt(page):1;
            let offset = (page_no-1)*limit;
            offset = (offset<0)?0:offset;

            let SaleInfoModel = loadModel('SaleInfoModel');
            let PaymentTypeModel = loadModel('PaymentTypeModel');
            let CustomerModel = loadModel('CustomerModel');

            let query_builder = SaleInfoModel.db.from(SaleInfoModel.table)
             .leftJoin(PaymentTypeModel.table,PaymentTypeModel.table+'.id','=',SaleInfoModel.table+'.payment_type_id')
             .leftJoin(CustomerModel.table,CustomerModel.table+'.id','=',SaleInfoModel.table+'.customer_id');

            if(search) query_builder.where((query)=>{
                search = search.trim()
                query.where(SaleInfoModel.table + '.invoice_no','like',`%${search}%`)
                query.orWhere(SaleInfoModel.table + '.invoice_date','like',`%${search}%`)
                query.orWhere(SaleInfoModel.table + '.invoice_item_count','like',`%${search}%`)
                query.orWhere(SaleInfoModel.table + '.net_amount','like',`%${search}%`)
                query.orWhere(SaleInfoModel.table + '.net_amount','like',`%${search}%`)
                query.orWhere(SaleInfoModel.table + '.down_payment','like',`%${search}%`)
                query.orWhere(SaleInfoModel.table + '.total_payment_amount','like',`%${search}%`)
                query.orWhere(PaymentTypeModel.table + '.name','like',`%${search}%`)
                query.orWhere(CustomerModel.table + '.name','like',`%${search}%`)
            });
            if (sort) {
                if (sort == 1) query_builder.orderBy(SaleInfoModel.table + '.created_at', 'asc')
                else if (sort == 4) query_builder.orderBy(SaleInfoModel.table + '.created_at', 'desc')
                else query_builder.orderBy(SaleInfoModel.table + '.id', 'desc')
            } else query_builder.orderBy(SaleInfoModel.table + '.id', 'desc')

            let qb = query_builder.clone();

            let rows = await query_builder.limit(limit)
                        .offset(offset)
                        .select([
                            SaleInfoModel.table+'.*',
                            PaymentTypeModel.table+'.name as payment_type_name',
                            CustomerModel.table+'.name as customer_name',
                        ]);
            let total_rows = await qb.count(SaleInfoModel.table + ".id", { as: 'total' }).first();
            let search_panel = {
                active:true,
                limit:true,
                data: {
                    sort: {
                        1: 'Created At - Ascending',
                        2: 'Created At - Descending',
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
            let pagination = new Pagination(total,page_no,'/admin/sale-info-list',limit,Req.query);
            data.pagination = pagination.links();
            Res.render('admin/sales/sale_info_list', data);
        }catch(err){
            errorLog(Req,Res,err);
            console.log(err);
            Res.render('errors/common_error',{Request:Req});
        }
        
    }
}
