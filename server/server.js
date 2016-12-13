require('./config/config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser'); //takes JSON and converts it into an object which we use to attach to the request object
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT; //heroku sets process.env.PORT

//app.use for middleware
app.use(bodyParser.json());

//TO-DO ROUTES
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

app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
      //we send an object instead of todos array for more flexibility
      res.send({
        todos
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//':id' is our url parameter, creates an id variable
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById({
    _id: id
  })
  .then((todo) => {
    if (!todo) {
      return res.status(404).send();
    } else {
      res.send({todo});
    }
  })
  .catch((err) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
  .then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  })
  .catch((err) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  //lodash fn, can only create a new object from req.body from the props in the array, limits the props the user can update
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    })
    .catch((err) => {
      res.status(400).send();
    });
});

//USER ROUTES
//1st private route
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      //create custom header with 'x-nameOfHeader'
      //user arg refers to user defined in var user = new User(body);
      res.header('x-auth', token).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken()
        .then((token) => {
          res.header('x-auth', token).send(user);
        });
    })
    .catch((err) => {
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  //authenticate gives us access to req.user and req.token
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(400).send();
    });
});

app.listen(port, () => {
  console.log(`Started up at ${port}`);
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
