var express = require('express');
var bodyParser = require('body-parser'); //takes JSON and converts it into an object which we use to attach to the request object

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

//app.use for middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save()
    .then((doc) => {
      res.send(doc);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {
  app
};

//Creating new user example
// var newUser = new User({
//   email: 'abc@123.com'
// });
//
// newUser.save()
//   .then((doc) => {
//     console.log('Saved user', doc);
//   })
//   .catch((err) => {
//     console.log('Could not save user', err);
//   });

//Creating new todo example
// var newTodo = new Todo({
//   text: 'Cook dinner'
// });
//
// newTodo.save()
//   .then((doc) => {
//     console.log('Save todo', doc);
//   })
//   .catch((err) => {
//     console.log('Unable to save todo', err);
//   });

//Creating new todo example
// var newTodo = new Todo({
//   text: 'Eat dessert',
//   completed: true,
//   completedAt: 805
// });
//
// newTodo.save()
//   .then((doc) => {
//     console.log('Save todo', doc);
//   })
//   .catch((err) => {
//     console.log('Unable to save todo', err);
//   });
