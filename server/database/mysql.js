var Promise = require('bluebird');

//https://github.com/petkaantonov/bluebird/blob/master/API.md#promisification
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var mysql = require('mysql');
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'test'
});

/**--------------------------------------------------------------------------------------------------
 * Taken from https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
 * This is to optimize argument slicing
 * ------------------------------------------------------------------------------------------------*/
var inlineSlice = function (func_args) {
    var $_len = func_args.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = func_args[$_i];}
    return args;
};

function getConnection() {
    return pool.getConnectionAsync().disposer(function(connection, promise) {
      connection.release();
    });
}


module.exports = {
  query: function () {
    var args = inlineSlice(arguments);

    return Promise.using(getConnection(), function(connection) {
        return connection
          .queryAsync
          .apply(connection, args)
          .get(0);
    });
  },

  withTransaction: function (fn) {
    return Promise.using(getConnection(), function (connection) {
      return connection
        .beginTransactionAsync()
        .then(function () {
          
          return Promise
            .try(fn, connection)
            .then(
                function (res) {
                  return connection.commitAsync().thenReturn(res);
                },
                function (err) {
                  return connection
                    .rollbackAsync()
                  // .catch(function(e) {})
                    .thenThrow(err);
                }
            );
        });

    });
  }
};
