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
            data.page_title = 'Point Of Sale'
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
        try {
        let sale_info_req_data={};
        let sale_item_req_data=[];
        let customer_req_data={};
        let customer_nominee_req_data={};
        let customer_due_req_data={};
        let due_collection_expected_date_req_data=[];

        let ActivityLogModel = loadModel('ActivityLogModel');
        let SaleInfoModel = loadModel('SaleInfoModel');
        let SaleItemModel = loadModel('SaleItemModel');
        let CustomerModel = loadModel('CustomerModel');
        let CustomerNomineeModel = loadModel('CustomerNomineeModel');
        let CustomerDueModel = loadModel('CustomerDueModel');
        let ExpectedDueCollectionDatesModel = loadModel('ExpectedDueCollectionDatesModel');

        let RequestData = loadValidator(Req, Res);
        
        let is_installMent = RequestData.post('is_installMent', false, 'is_installMent ').val();
        let isinstallment = typeof is_installMent !=='undefined' && is_installMent ==='on' ? true:false;
        let hidden_customer_id = RequestData.post('hidden_customer_id', false, 'hidden_customer_id ').type('int').val();
        let hidden_customer_nominee_id = RequestData.post('hidden_customer_nominee_id', false, 'hidden_customer_nominee_id ').type('int').val();
        let installment_duration = RequestData.post('installment_duration', isinstallment, 'installment_duration ').type('int').val();
        let invoice_no = RequestData.post('invoice_no', true, 'invoice no').type('string').val();
        let due_amount = RequestData.post('due_amount', isinstallment, 'due_amount ').type('number').val();
        let net_amount = RequestData.post('net_amount', true, 'net amount ').type('number').val();
        let down_payment_value = RequestData.post('down_payment', isinstallment, 'down payment').type('number').val();
        let item_identity_codes = RequestData.post('tbt_identity_code[]', true, 'Identity Code').val();
        let item_product_ids = RequestData.post('tbt_product_id[]', true, 'Product ID').val();
        let item_sale_qty = RequestData.post('tbl_sale_quantity[]', true, 'sale Qty').val();
        let item_sale_prices = RequestData.post('tbl_sale_price[]', true, 'sale Price').val();

        customer_req_data = {
            name: RequestData.post('customer_name', true, 'customer name').type('string').val(),
            address: RequestData.post('customer_address', true, 'customer address').val(),
            phone: RequestData.post('customer_phone', true, 'customer phone').type('mobile_bd').val(),
            nid_no: RequestData.post('customer_NID', false, 'customer NID').type('number').val(),
            created_by:Req.session.user.id,
            created_at:new Date()
        };
        customer_nominee_req_data = {
            nominee_name: RequestData.post('nominee_name', isinstallment, 'nominee name').type('string').val(),
            nominee_address: RequestData.post('nominee_address', isinstallment, 'nominee address').val(),
            nominee_phone: RequestData.post('nominee_phone', isinstallment, 'nominee phone').type('mobile_bd').val(),
            nominee_nid_no: RequestData.post('nominee_NID', false, 'nominee NID').type('number').val(),
            created_by:Req.session.user.id,
            created_at:new Date()
        };

        if (!RequestData.validate()) return false;
        let saveCustomerNominee = null;
        let saveCustomer = null;
        saveCustomer = hidden_customer_id.trim().length === 0 ? await CustomerModel.saveCustomerData(customer_req_data): hidden_customer_id;
        if (isinstallment) {
            saveCustomerNominee =hidden_customer_nominee_id.trim().length === 0? await CustomerNomineeModel.saveCustomerNomineeData(customer_nominee_req_data):hidden_customer_nominee_id;
        }
        sale_info_req_data = {
            invoice_no: invoice_no,
            invoice_item_count: RequestData.post('invoice_item', true, 'invoice item').val(),
            net_amount: net_amount,
            down_payment: (down_payment_value.trim().length !== 0) ? down_payment_value:0.00,
            total_payment_amount: RequestData.post('total_payable_amount', true, 'total payable amount ').type('number').val(),
            payment_type_id: RequestData.post('payment_type_id', true, 'payment type ').type('int').val(),
            is_installment: isinstallment ==true?1:0,
            created_by:Req.session.user.id,
            customer_id: saveCustomer,
            customer_nominee_id: saveCustomerNominee,
            created_at:new Date()
        };
        let saveSaleInfo = await SaleInfoModel.saveSaleInfoData(sale_info_req_data);
        if (saveSaleInfo) {
            sale_item_req_data = saleItemReqObjGenerate(Req,item_identity_codes,item_product_ids,item_sale_qty,item_sale_prices,saveSaleInfo);
            let saveSaleItem = await SaleItemModel.saveSaleItemData(sale_item_req_data);
            if (isinstallment) {
                customer_due_req_data = {
                    customer_id: saveCustomer,
                    sale_info_id: saveSaleInfo,
                    invoice_no: invoice_no,
                    invoice_amount: net_amount,
                    due_amount:due_amount,
                    remaining_amount: due_amount,
                    installment_duration: installment_duration,
                    created_by:Req.session.user.id,
                    created_at:new Date()
                };
                let saveCustomerDue = await CustomerDueModel.saveCustomerDueData(customer_due_req_data);
                due_collection_expected_date_req_data = expectedDateGenerateForDueCollection(Req,installment_duration,saveSaleInfo,saveCustomer);
                let saveCustomerDueCollDates = await ExpectedDueCollectionDatesModel.saveCustomerDueCollectionDate(due_collection_expected_date_req_data);
            }
            await ActivityLogModel.saveLogData(Req,Res,'Sale has been created by',SaleInfoModel.table,saveSaleInfo);
            Req.session.flash_toastr_success = `Data saved successfully! Invoice NO: ${invoice_no}`;
        }
        Res.redirect(`/admin/point-of-sale`);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Req.session.flash_toastr_error = 'Something Went Wrong!.';
           // Res.render('errors/common_error',{Request:Req});
           return back(Req, Res);
        }
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
                query.orWhere(CustomerModel.table + '.phone','like',`%${search}%`)
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
                            CustomerModel.table+'.phone as customer_phone',
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

    
    async invoiceDownload(Req, Res) {
        const fs = require("fs");
        const invoice = {};
        try {
            let invoiceNum = Req.params["invoiceNum"];
        var basePath = `./public/file_storage/`;
        var fullPath = `./public/file_storage/invoices/`;
          // check if directory exists
        if (!fs.existsSync(basePath)) {
            // if not create directory
            fs.mkdirSync(basePath);
        }
        if (!fs.existsSync(fullPath)) {
        // if not create directory
            fs.mkdirSync(fullPath);
        }
        let SaleInfoModel = loadModel('SaleInfoModel');
        let SaleItemModel = loadModel('SaleItemModel');
        let CustomerModel = loadModel('CustomerModel');

        let saleInfo = await SaleInfoModel.getSaleInfoByInvoiceNUm(invoiceNum);
        if (saleInfo) {
            let saleItems = await SaleItemModel.getSaleItemsBySaleInfo(saleInfo.id);
            let customerInfo = await CustomerModel.getCustomerInfoByid(saleInfo.customer_id);
            invoice.shipping=customerInfo;
            invoice.items=saleItems;
            invoice.saleInfo=saleInfo;
        }

        const { createInvoice } = loadLibrary('createinvoice');
        // const invoice = {
        //     shipping: {
        //         name: "Nure Ala Moududi",
        //         phone:'0170995314',
        //         address: "1234 Main Street",
        //         city: "Bogura",
        //         state: "Bogura",
        //         country: "Bangladesh",
        //         postal_code: 5800
        //     },
        //     items: [
        //     {
        //         identity_code:"5tgv",
        //         item: "TC 100",
        //         quantity: 2,
        //         amount: 6000
        //     },
        //     {
        //         identity_code:"6tgv",
        //         item: "USB_EXT",
        //         quantity: 1,
        //         amount: 2000
        //     },
        //     {
        //         identity_code:"6tgv",
        //         item: "USB_EXT",
        //         quantity: 1,
        //         amount: 2000
        //     }
        //     ,
        //     {
        //         identity_code:"6tgv",
        //         item: "USB_EXT",
        //         quantity: 1,
        //         amount: 2000
        //     }
        //     ,
        //     {
        //         identity_code:"6tgv",
        //         item: "USB_EXT",
        //         quantity: 1,
        //         amount: 2000
        //     }
        //     ,
        //     {
        //         identity_code:"6tgv",
        //         item: "USB_EXT",
        //         quantity: 1,
        //         amount: 2000
        //     }
        //     ,
        //     {
        //         identity_code:"6tgv",
        //         item: "USB_EXT",
        //         quantity: 1,
        //         amount: 2000
        //     }
        //     ,
        //     {
        //         identity_code:"6tgv",
        //         item: "USB_EXT",
        //         quantity: 1,
        //         amount: 2000
        //     }
        //     ,
        //     {
        //         identity_code:"6tgv",
        //         item: "USB_EXT",
        //         quantity: 1,
        //         amount: 2000
        //     }
            
        //     ],
        //     subtotal: 8000,
        //     paid: 8000,
        //     invoice_nr: invoiceNum,
        // };
            let fileName = fullPath +invoiceNum +'.pdf';
            createInvoice(invoice, fileName);
            return back(Req,Res);
        } catch (error) {
            errorLog(Req,Res,error);
            Req.session.flash_toastr_error = 'Something Went Wrong!.';
           return back(Req, Res);
        }
        
    }
}

function saleItemReqObjGenerate(Req, identityCodes,productIds,saleQtys,salePrices,saleInfoId) {
    let sale_item_req_obj=[];
    try {
        if (!Array.isArray(identityCodes) && identityCodes) {
            let stringValue = identityCodes;
            identityCodes = [];
            identityCodes.push(stringValue);
        }
        if (!Array.isArray(productIds) && productIds) {
            let stringValue = productIds;
            productIds = [];
            productIds.push(stringValue);
        }
        if (!Array.isArray(saleQtys) && saleQtys) {
            let stringValue = saleQtys;
            saleQtys = [];
            saleQtys.push(stringValue);
        } 
        if (!Array.isArray(salePrices) && salePrices) {
            let stringValue = salePrices;
            salePrices = [];
            salePrices.push(stringValue);
        } 

        for (let i = 0; i < identityCodes.length; i++) {
            const element = identityCodes[i];
            sale_item_req_obj.push({
                sale_info_id:saleInfoId,
                product_id:productIds[i],
                identity_code:element,
                quantity:saleQtys[i],
                sale_price:salePrices[i],
                sale_amount:parseInt(saleQtys[i]) * parseFloat(salePrices[i]),
                created_by:Req.session.user.id,
            });
        }
        return sale_item_req_obj;
    } catch (error) {
        console.log(error);
        return sale_item_req_obj;
    }
    
}

function expectedDateGenerateForDueCollection(Req,installment_duration,saleInfoId,customerId) {
    let expected_date_req_data=[];
    try {
        var today = new Date();
        for (let i = 1; i <= installment_duration; i++) {
            expected_date_req_data.push({
                sale_info_id: saleInfoId,
                customer_id:customerId,
                expected_date: new Date(new Date().setDate(today.getDate() + i * 30)),
                created_by:Req.session.user.id,
            });
        }
        return expected_date_req_data;
    } catch (error) {
        console.log(error);
        return expected_date_req_data;
    }
    
}

