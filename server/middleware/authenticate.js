var {User} = require('./../models/user.js');

//define our middleware
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  //given token, find associated user
  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject(); //goes to catch statement
      }

      req.user = user;
      res.token = token;
      next();
    })
    .catch((err) => {
      res.status(401).send();
    });
};

module.exports = {
  authenticate
};
