'use strict';

module.exports = function(app) {
    var todoList = require('./controller');

    app.route('/')
        .get(todoList.index);

    app.route('/api/shopping')
        .get(todoList.users);

    app.route('/api/shopping/:shopping_id')
        .get(todoList.findUsers);

    app.route('/api/shopping')
        .post(todoList.createUsers);

    app.route('/api/shopping')
        .put(todoList.updateUsers);
    
    app.route('/api/shopping')
        .delete(todoList.deleteUsers);
    
    app.route('/api/users/signup')
        .post(todoList.registers);

    app.route('/api/users/signin')
        .post(todoList.login);
        
    app.route('/api/users/verify')
        .post(todoList.verify);
};