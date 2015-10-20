var List = function (uuid, name, completed, created_at) { 
  if (!name) throw new Error('No name specified'); 

  this.uuid = uuid;
  this.name = name;
  this.completed = completed || 0;
  this.created_at = created_at || new Date();

  Object.defineProperty(this, 'todos', {
    value: []
  });
};


List.prototype.markAsCompleted = function () {
  this.completed = 1;
};

List.prototype.markAsIncomplete = function () {
  this.completed = 0;
};

List.prototype.addTodo = function (todo) {
  this.todos.push(
    todo 
  );
};

module.exports = List;
