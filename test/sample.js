/*global describe, it, beforeEach, inject, expect*/

(function() {

    'use strict';

    var $controller, $scope;

		beforeEach(module('myapp'));

    beforeEach(inject(function (_$controller_, _$rootScope_) {
			$scope = _$rootScope_.$new();

      $controller = _$controller_('myController', {$scope: $scope});
    }));

    describe('Adding todo', function () {
        it('should add new todo', function() {
          $scope.addTodo('foo');

          expect($scope.todos.length).toBe(1);
        });
    });

    describe('Removing todo', function () {
        it('should remove an exisiting todo', function() {
          $scope.addTodo('foo');
          
          $scope.removeTodo('foo');

          expect($scope.todos.length).toBe(0);
        });
    });

    describe('Completing a todo', function () {
      it('should mark a todo as completed', function () {
        $scope.addTodo('foo');

        $scope.complete('foo');
        
        expect($scope.completedItems().length).toBe(1);
      }); 
    });

})();
