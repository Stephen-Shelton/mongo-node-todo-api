const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

var id = '584b216d258d1fe982695c74';
if (!ObjectId.isValid(id)) {
  console.log('ID not valid');
}
//Ways to query with mongoose
//.find returns an array of documents
Todo.find({
  _id: id
})
.then((todos) => {
  console.log('Todos', todos);
});

//.findOne returns first matching doc based on criteria in obj passed in
Todo.findOne({
  _id: id
})
.then((todo) => {
  if (!todo) {
    return console.log('Doc not found');
  }
  console.log('Todo', todo);
});

//.findById returns doc with matching id
Todo.findById({
  _id: id
})
.then((todo) => {
  if (!todo) {
    return console.log('Id not found');
  }
  console.log('Todo By Id', todo);
})
.catch((err) => {
  console.log(err);
});

var userID = '584afeeedc76e48c71a0cb82';

User.findById({
  _id: userID
})
.then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log('User by id', user);
})
.catch((err) => {
  console.log(err);
});
