var Promise = require('bluebird');
var spyReq = function () {
  var deferred = Promise.defer();
  var res = {
    send: function (result) {
      return deferred.resolve(result);
    }
  };
  var req = {
    body: {},
    params: {},
    query: {}
  };

  return {
    req: req,
    res: res,
    result: deferred.promise
  };
};

module.exports = spyReq;
