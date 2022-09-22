
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('role_has_permissions').del()
    .then(function () {
      // Inserts seed entries
      return knex('role_has_permissions').insert([
        {permission_id:7,role_id: 1},
        {permission_id:8,role_id: 1},
        {permission_id:9,role_id: 1},
        {permission_id:11,role_id: 1},
      ]);
    });
};
