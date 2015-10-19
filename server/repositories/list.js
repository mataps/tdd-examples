var mysql = require('../database/mysql.js');
var List = require('../collections/List.js');
var Promise = require('bluebird');

var listRepository = {

  find: function () {
    return mysql
      .query('SELECT * FROM lists');
  },

  findOneByName: function (name) {
    return mysql
      .query('SELECT * FROM lists WHERE name=?', name)
      .get(0)
      .then(function (result) {
        return new List(result.uuid, result.name, result.completed, result.created_at);
      });
  },

  findByUUID: function (uuid) {
    return mysql
      .query('SELECT * FROM lists WHERE uuid=?', uuid)
      .get(0)
      .then(function(result) {
        return new List(result.uuid, result.name, result.completed, result.created_at);
      });
  },

  create: function (list) {
    return mysql
      .query('INSERT INTO lists SET ?', list);
  },

  save: function (list) {
    return mysql
      .withTransaction(function (tx) {

        return tx
          .queryAsync('INSERT INTO lists SET ?', [list, list.uuid])
          .then(function () {
            return Promise.map(list.todos, function (todo) {
              return tx.queryAsync('INSERT INTO todos SET ?', todo);
            });
          })
          .thenReturn(list);
      });
  },

  delete: function () {}
};

module.exports = listRepository;
