const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');


//Todo.remove
//removes all todos from our db, don't get docs back
// Todo.remove({})
//   .then((result) => {
//     console.log(result);
//   });

//removes doc and returns it
Todo.findOneAndRemove({text: 'test to do'})
  .then((todo) => {
    console.log(todo);
  });

//returns deleted doc
// Todo.findByIdAndRemove('584b5a367ef584d985759706')
//   .then((todo) => {
//     console.log(todo);
//   });
