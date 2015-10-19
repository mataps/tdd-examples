var app = angular.module('myapp', []);

//
// app.config(function () {
//
// });

app.controller('myController', function ($scope) {
  $scope.todos = [];

  $scope.addTodo = function (name) {
    $scope.todos.push({
      name: name,
      completed: false
    });
  };

  $scope.removeTodo = function (name) {
    _.remove($scope.todos, {
      name: name
    });
  };

  $scope.complete = function (name) {
    $scope.todos = _.map($scope.todos, function (item) {
      if (item.name === name) {
        item.completed = true;
      }

      return item;
    });
  };

  $scope.completedItems = function () {
    return _.where($scope.todos, {completed: true});
  };
});
