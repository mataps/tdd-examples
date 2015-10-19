var Todo = function (uuid, text) {
  this.uuid = uuid;
  this.text = text;
  this.done = 0;
  this.created_at = new Date();
};


module.exports = Todo;
