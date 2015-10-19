var mysql = require('../../database/mysql.js');
var uuid = require('node-uuid');
var listRepository = require('../../repositories/list.js');
var List = require('../../collections/List.js');

  
var TodoController = {

  create: function (req, res) {
    var list = new List(uuid.v4(), req.body.name);
    listRepository
      .save(list)
      .then(function (result) {
        res.send(result);
      });
  },
  
  find: function (req, res) {
    listRepository
      .find()
      .then(function(rows) {
        res.send(rows);
      });
  },

  markAsCompleted: function (req, res) {
    listRepository
      .findByUUID(req.params.uuid)
      .then(function (list) {
        list.markAsCompleted();
        listRepository
          .save(list)
          .then(function () {
            res.send({
              success: true
            });
          });
      });
  }

};


module.exports = TodoController;
