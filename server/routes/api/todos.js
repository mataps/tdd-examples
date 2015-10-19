var todoController = require('../../controllers/api/list.js');


module.exports = function (router) {

  router.get('/', todoController.find);
  router.post('/', todoController.create);
  router.post('/:uuid/complete', todoController.markAsCompleted);


  return router;
};
