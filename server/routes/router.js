var express = require('express');
var router = express.Router();
var requireDirectory = require('require-directory');
var blacklist = /router\.js$/;
var routeFiles = requireDirectory(module, {exclude: blacklist});
var routes = {};
var route = '';

for (var i in routeFiles) {
  for (var j in routeFiles[i]) {
    route = j === 'index' ? '' : '/' + j;
    routes[i] = routes[i] || express.Router();
    routes[i] = routes[i].use(route, routeFiles[i][j](express.Router()));
  }
}


//frontend
// router.use('/', frontend);
router.use('/api', routes.api);
// router.use('/admin', admin);

module.exports = router;
