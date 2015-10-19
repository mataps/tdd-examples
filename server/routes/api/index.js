module.exports = function (router) {

  router.get('/', function (req, res) {
    res.json({
      message: 'API index page'
    });
  });


  return router;
};
