require('../system/loader');
const express = require('express');
const route = express.Router();
exports.routes = route;

const auth = loadMiddleware('auth');
const has_permission = loadMiddleware('has_permission');
const single_uploader = loadMiddleware('single_uploader');
/*
 @write your routes blow:
*/
exports.prefix = 'admin/';

//dashboard
route.get('/',auth, controller('admin/dashboard/index'));
route.get('/dashboard',auth, controller('admin/dashboard/index'));

//Password Reset
route.get('/forgot-password', controller('admin/auth/forgot_password/forgotPassword'));
route.post('/forgot-password/link-send', controller('admin/auth/forgot_password/sendPasswordResetLink'));
route.get('/reset-password/:token', controller('admin/auth/forgot_password/resetPassword'));
route.post('/reset-password/:token', controller('admin/auth/forgot_password/resetPasswordSave'));

//auth
route.get('/login', controller('admin/auth/login/login'));
route.post('/login', controller('admin/auth/login/attemptLogin'));
route.post('/logout',auth, controller('admin/auth/login/logout'));

//Users
route.get('/users',auth, has_permission(['users.list']), controller('admin/user/user/userList'));
route.get('/users/:id',auth,has_permission(['users.show']), controller('admin/user/user/userDetails'));
route.get('/users/:id/user-edit',auth,has_permission(['users.edit']), controller('admin/user/user/userEdit'));
route.post('/user-edit',auth, has_permission(['users.edit']), controller('admin/user/user/userDataEdit'));
route.get('/user-create',auth,has_permission(['users.create']), controller('admin/user/user/userCreate'));
route.post('/user-create',auth, has_permission(['users.create']), controller('admin/user/user/userSave'));
route.post('/users/:id/delete',auth, has_permission(['users.delete']), controller('admin/user/user/deleteUser'));

//profile
route.get('/profile',auth, controller('admin/user/profile/profileEdit'));
route.post('/profile/basic-info_update',auth, controller('admin/user/profile/basicInfoUpdate'));
route.post('/profile/password_update',auth, controller('admin/user/profile/passwordUpdate'));
route.post('/profile/profile_photo_update',auth, single_uploader('user-photos'), controller('admin/user/profile/userImageUpdate'));
//Role
route.get('/settings/roles',auth, has_permission(['roles.list']), controller('admin/user/role/roleList'));
route.get('/settings/create-roles',auth, has_permission(['roles.create']), controller('admin/user/role/roleCreate'));
route.post('/settings/create-roles',auth, has_permission(['roles.create','roles.edit']), controller('admin/user/role/roleSaveOrUpdate'));
route.get('/settings/role/:id/edit-roles',auth, has_permission(['roles.edit']), controller('admin/user/role/roleEdit'));
route.post('/settings/role/:id/delete-roles',auth, has_permission(['roles.delete']), controller('admin/user/role/roleDelete'));
route.get('/settings/roles/permissions',auth,has_permission(['roles.show']), controller('admin/user/role/rolePermission'));
route.get('/settings/permissions-check/:role_id',auth, has_permission(['roles.list']),controller('admin/user/role/rolePermissionCheck'));
route.post('/settings/roles/:role_id/permissions',auth, has_permission(['roles.assign.permission']), controller('admin/user/role/assignPermission'));
//Acl
route.get('/settings/acl',auth, has_permission(['acl.list']), controller('admin/user/acl/aclList'));
route.get('/settings/acl/create',auth, has_permission(['acl.create']), controller('admin/user/acl/aclCreate'));
route.post('/settings/acl/:id/permissions',auth, has_permission(['acl.create']), controller('admin/user/acl/assignAclPermission'));
route.get('/settings/direct-permissions-check/:id',auth, has_permission(['acl.list']),controller('admin/user/acl/userDirectPermissionCheck'));
//LOGS
route.get('/logs/user',auth,has_permission(['system.log.list']), controller('admin/user_log/logList'));
//Product
 route.get('/products',auth,has_permission(['product.list']), controller('admin/product/productList'));
 route.get('/products-stock',auth,has_permission(['product.stock.list']), controller('admin/product/productStockInfo'));
 route.get('/products/product-create',auth,has_permission(['product.create']), controller('admin/product/productCreate'));
 route.post('/products/product-create',auth,has_permission(['product.create']),single_uploader('products'), controller('admin/product/productDataSave'));
 route.get('/products/:id/product-edit',auth, has_permission(['product.edit']),controller('admin/product/productEdit'));
 route.post('/products/product-edit',auth, has_permission(['product.edit']),single_uploader('products'), controller('admin/product/productDataUpdate'));
 route.post('/products/:id/product-delete',auth, has_permission(['product.delete']), controller('admin/product/productDelete'));
//Inentory
route.post('/inventory/:product_id/:identity_code/inventory-save',auth, has_permission(['inventory.create']), controller('admin/inventory/productInventorySave'));
//Point Of Sale
 route.get('/point-of-sale',auth,has_permission(['sale.create']), controller('admin/sale/pointOfSale'));
 route.get('/sale-info-list',auth,has_permission(['sale.info.list']), controller('admin/sale/saleInfoList'));
 route.get('/sale-details/:invoice_num',auth,has_permission(['sale.info.list']), controller('admin/sale/saleDetailsByInvoice'));
 route.get('/get-product-details/:identity_code',auth,has_permission(['sale.create']), controller('admin/sale/getProductDetailsWithStock'));
 route.post('/point-of-sale/save',auth,has_permission(['sale.create']), controller('admin/sale/saveSaleData'));
 route.post('/invoice-download', auth, controller('admin/sale/invoiceDownload'));

 //Customers
 route.get('/customer-due',auth,has_permission(['customer.due.list']), controller('admin/customer/dueCustomerList'));
 route.get('/customer-info-by-mobile/:mobile',auth, controller('admin/customer/customerInfoByMobile'));
 route.get('/customer-nominee-info-by-mobile/:mobile',auth, controller('admin/customer/customernomineeInfoByMobile'));
 route.get('/customer-due-collection-details/:due_id',auth, controller('admin/customer/customerDueCollectionDetailsByInvoice'));
 route.post('/customer-due-collection/:customer_due_id/:invoice_num/customer-due-collection-save',auth, has_permission(['due.collection']), controller('admin/customer/customerDueCollectionSave'));

 //Report 
 route.get('/report/sale-summary',auth, has_permission(['sale.summary.report']), controller('admin/report/saleSummary'));
 route.post('/report/sale-summary-download', auth,has_permission(['sale.summary.report']), controller('admin/report/saleSummaryDownload'));

//Providers
// route.get('/provider',auth,has_permission(['provider.list']), controller('admin/provider/providerList'));
// route.get('/provider/provider-create',auth,has_permission(['provider.create']), controller('admin/provider/providerCreate'));
// route.post('/provider/provider-create',auth,has_permission(['provider.create']), single_uploader('providers'), controller('admin/provider/providerDataSave'));
// route.get('/provider/:id/provider-edit',auth, has_permission(['provider.edit']), controller('admin/provider/providerEdit'));
// route.post('/provider/provider-edit',auth, has_permission(['provider.edit']), single_uploader('providers'), controller('admin/provider/providerDataEdit'));
// route.post('/provider/:id/provider-delete',auth, has_permission(['provider.delete']), controller('admin/provider/providerDelete'));


//sales-units
// route.get('/sales-units',auth,has_permission(['sale-unit.list']),controller('admin/sales_unit/index'))
// route.get('/sales-units/create',auth,has_permission(['sale-unit.create']),controller('admin/sales_unit/create'))
// route.post('/sales-units',auth,has_permission(['sale-unit.create']),controller('admin/sales_unit/store'))
// route.get('/sales-units/:id/edit',auth,has_permission(['sale-unit.edit']),controller('admin/sales_unit/edit'))
// route.post('/sales-units/:id/edit',auth,has_permission(['sale-unit.edit']),controller('admin/sales_unit/update'))
// route.post('/sales-units/:id/delete',auth,has_permission(['sale-unit.delete']),controller('admin/sales_unit/destroy'))

// //currencies
// route.get('/currencies',auth,has_permission(['currency.list']),controller('admin/currency/index'))
// route.get('/currencies/create',auth,has_permission(['currency.create']),controller('admin/currency/create'))
// route.post('/currencies',auth,has_permission(['currency.create']),controller('admin/currency/store'))
// route.get('/currencies/:id/edit',auth,has_permission(['currency.edit']),controller('admin/currency/edit'))
// route.post('/currencies/:id/edit',auth,has_permission(['currency.edit']),controller('admin/currency/update'))
// route.post('/currencies/:id/delete',auth,has_permission(['currency.delete']),controller('admin/currency/destroy'))



