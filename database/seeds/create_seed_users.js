
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      //password:11111111
      return knex('users').insert([
        {id: 1, name: 'NoyonMoududi',email:'noyon@mail.com',phone:'01706995314',address:'NA',shop_id:1,password:'$2a$10$k15Mhc0hw8ZSW8y8BT9MyuvUkX0nIYeTwdNDLNSufBXaQQLuTA1oi'},
      ]);
    });
};
