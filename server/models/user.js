const mongoose = require('mongoose');
const validator = require('validator'); //library to validate emails
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

/*
Example user doc
  {
    email: 'stephen@example.com',
    password: '34l5jlk345lk34', <--hashed pw
    tokens: [{
      access: 'auth',
      token: '24l5j425lkhy60z0xcb' <--token passed into requests for auth
    }]
  }
*/

//to tack on custom instance methods, use new mongoose.Schema
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true, //every email in collection must be unique
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//override a method with a custom method, goal to return object with limited data back to user
UserSchema.methods.toJSON = function() {
  var user = this;
  //toObject, a native mongoose method, takes a complex mongoose user/doc and converts it to a regular object
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']); //create new obj and return it
};

//add custom methods to use with instances of models here
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  //ultimately returns the token back to the user when user makes post req
  return user.save()
    .then(() => {
      return token;
    });
};

//run code before you run an event 'save', we use mongoose middleware to help us hash pws before we save them to the db
UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    var password = user.password;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        user.password = hash; //overrides the old pw
        next(); //call next to proceed with middleware
      });
    });
  } else {
    next();
  }
});

//Create model method with .statics (.methods for instance methods)
UserSchema.statics.findByToken = function(token) {
  var User = this; //binding is to model since it's a model method
  var decoded; //will store decoded jwt values from jwt.verify()

  //any code errors in try => code stops execution and goes to catch block
  try {
    decoded = jwt.verify(token, 'abc123'); //'abc123' is our secret token
  } catch (err) {
    //if error with try, return promise that gets rejected / passed to catch statement in '/users/me' get request
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject(); //same as 3 lines above, can pass in val too
  }

  //if try successful, returns a promise with user to /users/me get request
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

//Define model here passing in model name and schema
var User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
