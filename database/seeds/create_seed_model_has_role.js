
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('model_has_roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('model_has_roles').insert([
        {role_id: 1, model_type: 'User',model_id:1},
      ]);
    });
};
