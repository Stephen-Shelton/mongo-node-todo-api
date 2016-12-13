const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
//1st dummy user valid, 2nd one invalid
const users = [
  {
    _id: userOneId,
    email: 'stephen@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
];

//dummy array of todos for testing get request
const todos = [
  {
    _id: new ObjectId(),
    text: 'First test todo',
    // completed: false,
    // completedAt: null,
    _creator: userOneId

  },
  {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }
];

const populateTodos = (done) => {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(todos);
  })
  .then(() => {
    done();
  });
};

const populateUsers = (done) => {
  //remove all users from test db then add them
  User.remove({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      //run userOne and userTwo, then run done()
      Promise.all([userOne, userTwo]);
    })
    .then(() => {
      done();
    });
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
