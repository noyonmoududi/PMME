const Controller = loadCore('controller');

module.exports = class product extends Controller {

    constructor() {
        super();
    }
    async productList(Req, Res) {

        try{
            let {page,search,sort,limit} = Req.query;
            limit =limit || 10;
            let page_no = (page)?parseInt(page):1;
            let offset = (page_no-1)*limit;
            offset = (offset<0)?0:offset;

            let ProductModel = loadModel('ProductModel');
            let BrandModel = loadModel('BrandModel');
            let CategoryModel = loadModel('CategoryModel');

            let query_builder = ProductModel.db.from(ProductModel.table)
            .leftJoin(BrandModel.table,BrandModel.table+'.id','=',ProductModel.table+'.brand_id')
            .leftJoin(CategoryModel.table,CategoryModel.table+'.id','=',ProductModel.table+'.category_id');

            if(search) query_builder.where((query)=>{
                search = search.trim()
                query.where(ProductModel.table + '.name','like',`%${search}%`)
                query.orWhere(ProductModel.table + '.identity_code','like',`%${search}%`)
                query.orWhere(ProductModel.table + '.purchase_price','like',`%${search}%`)
                query.orWhere(ProductModel.table + '.sale_price','like',`%${search}%`)
                query.orWhere(BrandModel.table + '.name','like',`%${search}%`)
                query.orWhere(CategoryModel.table + '.name','like',`%${search}%`)
            });
            if (sort) {
                if (sort == 1) query_builder.orderBy(ProductModel.table + '.created_at', 'asc')
                else if (sort == 4) query_builder.orderBy(ProductModel.table + '.created_at', 'desc')
                else query_builder.orderBy(ProductModel.table + '.id', 'desc')
            } else query_builder.orderBy(ProductModel.table + '.id', 'desc')

            let qb = query_builder.clone();

            let rows = await query_builder.limit(limit)
                        .offset(offset)
                        .where(ProductModel.table + '.status',1)
                        .select([
                            ProductModel.table+'.*',
                            BrandModel.table+'.name as brand_name',
                            CategoryModel.table+'.name as category_name',
                        ]);
            let total_rows = await qb.count(ProductModel.table + ".id", { as: 'total' }).first();
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
            let pagination = new Pagination(total,page_no,'/admin/product',limit,Req.query);
            data.pagination = pagination.links();
            Res.render('admin/product/index', data);
        }catch(err){
            errorLog(Req,Res,err);
            console.log(err);
            Res.render('errors/common_error',{Request:Req});
        }
    }

    async productCreate(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        try {
            let random = require("randomstring");
            let randomCode = random.generate(8);
            let CategoryModel = loadModel('CategoryModel');
            let BrandModel = loadModel('BrandModel');
            let categories = await CategoryModel.getAllCategory();
            let brands = await BrandModel.getAllBrands();
            data.categoryData = categories;
            data.brandData = brands;
            data.identity_code = randomCode;
            data.page_title = 'Create product';
            Res.render('admin/product/create',data);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.render('errors/common_error',{Request:Req});
        }
    }

    async productDataSave(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        let uploadfileName =null;
        try {
            if (Req.files && Req.files.length > 0) {
                uploadfileName = Req.files[0].filename;
            }
            let req_data={};
            let RequestData = loadValidator(Req, Res);
            req_data = {
                identity_code: RequestData.post('identity_code', true, 'identity code').type('string').val(),
                name: RequestData.post('name', true, 'Product name').val(),
                category_id: RequestData.post('category_id', true, 'category ').type('int').val(),
                purchase_price: RequestData.post('purchase_price', true, 'purchase price').type('number').val(),
                sale_price: RequestData.post('sale_price', true, 'sale price').type('number').val(),
                brand_id: RequestData.post('brand_id', true, 'Brand ').type('int').val(),
                description: RequestData.post('description', false, 'description ').type('string').val(),
                image:uploadfileName,
                created_by:Req.session.user.id,
                created_at:new Date(),
                updated_at:new Date(),
            };
           
                if (!RequestData.validate()) return false;
                let ProductModel = loadModel('ProductModel');
                let existProduct = await ProductModel.getProductByCode(req_data.identity_code);
                if (!existProduct) {
                    let productSave = await ProductModel.saveProduct(req_data);      
                    await ActivityLogModel.saveLogData(Req,Res,'products has been created by',ProductModel.table,productSave);
                    Req.session.flash_toastr_success = 'Product Created successfully!';
                    Res.redirect(`/admin/products`);
                }else{
                    Req.session.flash_toastr_error = 'Product Identity Code Already exist!.';
                    Res.redirect(`/admin/products/product-create`);
                }
           
        } catch (err) {
            errorLog(Req,Res,err);
            await deleteFile(uploadfileName);
            console.log(err);
            Req.session.flash_toastr_error = 'Something Went Wrong';
            return back(Req, Res);
        }
    }
    async productEdit(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        try {
            data.page_title = 'Edit Product';
            let id = Req.params["id"];

            let ProductModel = loadModel('ProductModel');
            let CategoryModel = loadModel('CategoryModel');
            let BrandModel = loadModel('BrandModel');
            let categories = await CategoryModel.getAllCategory();
            let brands = await BrandModel.getAllBrands();
            let rowdata = await ProductModel.getProductByProductId(id);
            data.old = rowdata;
            data.categoryData = categories;
            data.brandData = brands;
            Res.render('admin/product/edit',data);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Res.render('errors/common_error',{Request:Req});
        }
        
    }

    async productDataUpdate(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        let uploadfileName =null;
        try {
            if (Req.files && Req.files.length > 0) {
                uploadfileName = Req.files[0].filename;
            }
            let req_data={};
            let RequestData = loadValidator(Req, Res);
            let id = RequestData.post('productId', true, 'productId').val();
            let previousFile = RequestData.post('previousFile', false, 'previousFile').val();
            req_data = {
                id:id,
                identity_code: RequestData.post('identity_code', true, 'identity code').type('string').val(),
                name: RequestData.post('name', true, 'Product name').val(),
                category_id: RequestData.post('category_id', true, 'category ').type('int').val(),
                purchase_price: RequestData.post('purchase_price', true, 'purchase price').type('number').val(),
                sale_price: RequestData.post('sale_price', true, 'sale price').type('number').val(),
                brand_id: RequestData.post('brand_id', true, 'Brand ').type('int').val(),
                description: RequestData.post('description', false, 'description ').type('string').val(),
                updated_by:Req.session.user.id,
                updated_at:new Date(),
            };
            if (uploadfileName != null) {
                req_data.image=uploadfileName;
            }
            if (!RequestData.validate()) return false;
            let ProductModel = loadModel('ProductModel');
            let existProduct = await ProductModel.getProductByProductId(id);
            if (typeof(existProduct) == "undefined"|| req_data.identity_code==existProduct.identity_code) {
                if (previousFile && typeof previousFile !='undefined' && uploadfileName != null) {
                    await deleteFile(previousFile);
                }
                let productUpdate = await ProductModel.updateProduct(req_data);      
                await ActivityLogModel.saveLogData(Req,Res,'Product has been updated by',ProductModel.table,id);
                Req.session.flash_toastr_success = 'Product Updated successfully!';
                Res.redirect(`/admin/products`);
            } else {
                Req.session.flash_toastr_error = 'Product Identity Code Already Exist!.';
                Res.redirect(`/admin/products`);
            }
        } catch (err) {
            errorLog(Req,Res,err);
            await deleteFile(uploadfileName);
            console.log(err);
            Req.session.flash_toastr_error = 'Something Went Wrong';
            return back(Req, Res);
        }
    }

    async productDelete(Req,Res){
        let ActivityLogModel = loadModel('ActivityLogModel');
        try {
            let id = Req.params["id"];
            let ProductModel = loadModel('ProductModel');
            let rowdata = await ProductModel.getProductByProductId(id);
            if (typeof rowdata != 'undefined') {
                let req_data ={
                    id:id,
                    identity_code: rowdata.identity_code,
                    status: 0
                };
                let result = await ProductModel.updateProduct(req_data);// just Status Update
                Req.session.flash_toastr_success = 'Product Deleted successfully!';
                await ActivityLogModel.saveLogData(Req,Res,'Product has been deleted by',ProductModel.table,id);
            }else{
                Req.session.flash_toastr_error = 'Data Not Found!.';
            }
            Res.redirect(`/admin/products`);
        } catch (error) {
            errorLog(Req,Res,error);
            Req.session.flash_toastr_error = 'Something Went wrong!..';
            Res.redirect(`/admin/products`);
        }
    }
}

async function deleteFile(filename) {
    if (filename && filename != null) {
        const fs = require("fs");
        if (fs.existsSync(`./public/file_storage/products/${filename}`)) {
            fs.unlink(`./public/file_storage/products/${filename}`,function(err){
                if(err) console.log(err);
                console.log('Upload file deleted successfully');
            }); 
        }  
    }
}