var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //tells mongoose we're using native promises

mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
};
