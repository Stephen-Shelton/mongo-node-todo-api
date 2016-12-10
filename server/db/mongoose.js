var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //tells mongoose we're using native promises

//Use mongodb_uri if it exists, else use local version
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
