const mongoose = require('mongoose');
const validator = require('validator'); //library to validate emails
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

//override a method with a custom method, goal to return trimmed data to user
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

//Define model here passing in model name and schema
var User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
