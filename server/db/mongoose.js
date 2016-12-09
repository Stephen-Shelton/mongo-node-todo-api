var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //tells mongoose we're using native promises
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
