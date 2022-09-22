
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('permissions').del()
    .then(function () {
      // Inserts seed entries
      return knex('permissions').insert([
        {id: 1, name: 'users.list',guard_name:'web'},
        {id: 2, name: 'users.create',guard_name:'web'},
        {id: 3, name: 'users.show',guard_name:'web'},
        {id: 4, name: 'users.edit',guard_name:'web'},
        {id: 5, name: 'users.delete',guard_name:'web'},
        {id: 7, name: 'roles.list',guard_name:'web'},
        {id: 8, name: 'roles.show',guard_name:'web'},
        {id: 9, name: 'roles.assign.permission',guard_name:'web'},
        {id: 10, name: 'roles.delete',guard_name:'web'},
        {id: 11, name: 'roles.create',guard_name:'web'},
        {id: 12, name: 'roles.edit',guard_name:'web'},
        {id: 13, name: 'system.log.list',guard_name:'web'},
        {id: 14, name: 'acl.list',guard_name:'web'},
        {id: 15, name: 'acl.create',guard_name:'web'}
      ]);
    });
};
