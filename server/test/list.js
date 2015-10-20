var listController = require('../controllers/api/list.js');
var todoController = require('../controllers/api/todos.js');
var listRepository = require('../repositories/list.js');

var expect = require('expect.js');
var mysql = require('../database/mysql.js');
var spyRequest = require('./test_helpers/spyRequest.js');

var req;
var res;
var promise;

var spyReset = function () {
  var spy = spyRequest();
  req = spy.req;
  res = spy.res;
  promise = spy.result;
};


describe('List', function() {
  var list;

  before(function () {
    spyReset();
    req.body = {name: 'foo'};
    listController.create(req, res);
    return promise.then(function (response) {
      list = response;
      expect(response).to.be.ok();
      expect(response.name).to.be(req.body.name);
    });
  });

  beforeEach(function () {
    spyReset();
  });

  after(function () {
    return Promise.all([
      mysql.query('DELETE FROM lists'),
      mysql.query('DELETE FROM todos')
    ]);
  });

  // it('should return lists collection', function() {
  //   listController.find(req, res);
  //
  //   return promise.then(function(response) {
  //     expect(response).to.not.be.empty();
  //   });
  // });
  
  describe('#create', function () {

    it('should succeed with no error', function () {
      req.body = {name: 'foo'};
      return listRepository.findOneByName(req.body.name)
        .then(function (result) {
          expect(result).to.eql(list);
        });
    });

    it('should throw an error on duplicate name', function (done) {
      spyReset();
      req.body = {name: 'foo'};
      listController.create(req, res);
      process.once("unhandledRejection", function(reason, promise) {
        done(); 
      });
    });

    it('should throw an error when no name is specified', function () {
      spyReset();
      req.body = {name: ''};
      expect(listController.create).withArgs(req, res).to.throwError();
    });

  });


  describe('#update', function () {

    it('should mark a list as completed', function () {
      req.body = {uuid: list.uuid};
      listController.markAsCompleted(req, res);

      return promise
        .then(function(response) {
          expect(response.uuid).to.be(list.uuid);
          expect(response.completed).to.be(1);

          return listRepository
            .findOneByName(list.name)
            .then(function (listResult) {
              expect(listResult).to.eql(response);
            });
        });
    });
    
    it('should mark a list as incomplete', function () {
      req.body = {uuid: list.uuid};
      listController.markAsIncomplete(req, res);

      return promise
        .then(function(response) {
          expect(response.uuid).to.be(list.uuid);
          expect(response.completed).to.be(0);

          return listRepository
            .findOneByName(list.name)
            .then(function (listResult) {
              expect(listResult).to.eql(response);
            });
        });
    });

  });

  describe('#delete', function () {
    it('should remove a list', function () {
      req.body = {uuid: list.uuid};
      listController.remove(req, res);

      return promise
        .then(function(response) {
          expect(response.uuid).to.be(list.uuid);

          return listRepository
            .findOneByName(list.name)
            .catch(function (error) {
              expect(error).to.be.a(Error);
            });
        });
    });
  });

  //
  // it('should add a todo to a list', function () {
  //   return listRepository
  //     .findOneByName('foo')
  //     .then(function (list) {
  //       req.params = {
  //         listId: list.uuid,
  //         text: 'bar'
  //       }; 
  //       todoController.create(req, res);
  //
  //       return promise.then(function (response) {
  //         expect(response.success).to.be.ok();
  //
  //           return mysql
  //             .query('SELECT * from todos WHERE uuid=?', response.data.id)
  //             .then(function (rows) {
  //               expect(rows).to.not.be.empty();
  //             });
  //       });
  //     });
  // });

  // it('should mark a todo as done', function () {
  //   return listRepository
  //     .findOneByNameWithTodos('foo')
  //     .then(function (list) {
  //       req.params = {
  //         listId: list.uuid,
  //         todoId: list.todos[0].uuid
  //       };
  //     });
  // });

});
