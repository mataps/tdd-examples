var mysql = require('../../database/mysql.js');
var uuid = require('node-uuid');
var listRepository = require('../../repositories/list.js');
var List = require('../../domain/List.js');

  
var ListController = {

  create: function (req, res) {
    var list = new List(uuid.v4(), req.body.name);
    listRepository
      .insert(list)
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
      .findByUUID(req.body.uuid)
      .then(function (list) {
        list.markAsCompleted();
        listRepository
          .update(list)
          .then(function (result) {
            res.send(result);
          });
      });
  },

  markAsIncomplete: function (req, res) {
    listRepository
      .findByUUID(req.body.uuid)
      .then(function (list) {
        list.markAsIncomplete();
        listRepository
          .update(list)
          .then(function (result) {
            res.send(result);
          });
      });
  },

  remove: function (req, res) {
    listRepository
      .findByUUID(req.body.uuid)
      .then(function (list) {
        listRepository
          .remove(list)
          .then(function (result) {
            res.send(result);
          });
      });
  }

};


module.exports = ListController;
