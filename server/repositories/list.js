var mysql = require('../database/mysql.js');
var List = require('../domain/List.js');
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
        if (!result) throw new Error('List not found');
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

  insert: function (list) {
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

  update: function (list) {
    return mysql
      .withTransaction(function (tx) {
        return tx
          .queryAsync('UPDATE lists SET ? WHERE uuid=?', [list, list.uuid])
          .then(function () {
            return Promise.map(list.todos, function (todo) {
              return tx.queryAsync('INSERT INTO todos SET ?', todo);
            });
          })
          .thenReturn(list);
      });
  },

  remove: function (list) {
    return mysql.query('DELETE FROM lists WHERE uuid=?', list.uuid)
      .thenReturn(list);
  }
};

module.exports = listRepository;
