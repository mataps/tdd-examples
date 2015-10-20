var mysql = require('../../database/mysql.js');
var uuid = require('node-uuid');
var listRepository = require('../../repositories/list.js');
var Todo = require('../../domain/Todo.js');

var TodoController = {

  create: function (req, res) {
    listRepository
      .findByUUID(req.params.listId)
      .then(function (list) {
        var todo = new Todo(uuid.v4(), req.params.text);
        list.addTodo(todo);
        listRepository
          .save(list)
          .then(function () {
            res.send({
              success: true,
              data: { id: todo.uuid }
            });
          });
      });
  }

};

module.exports = TodoController;
