// const MongoClient = require('mongodb').MongoClient;

// Object destructuring lets you create vars from props/vals in objects
  // var user = {name: 'Stephen', age: 26};
  // var {name} = user; //creates var name = 'Stephen';
  // console.log(name);
const {MongoClient, ObjectID} = require('mongodb'); //extract vals and create vars from mongodb object

// var obj = new ObjectID(); //create new instance of ObjectID
// console.log(obj);

//Our db name is TodoApp, don't need to create a db before using it. Once we name our db and add data, the db gets created
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //fetch docs, convert them to array, print them to console
  db.collection('Todos')
    .find()
    .toArray()
    .then((docs) => {
      console.log('Todos');
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('Unable to fetch todos, err');
    });

  //create collection and insert doc into collection
  // db.collection('Todos')
  //   .insertOne({
  //     text: 'Something to do',
  //     completed: false
  //   }, (err, result) => {
  //     if (err) {
  //       return console.log('Unable to insert todo', err);
  //     }
  //
  //     console.log(JSON.stringify(result.ops, undefined, 2));
  //   });

  //Insert new doc into users (name, age, location)
  // db.collection('Users')
  //   .insertOne({
  //     name: 'Stephen',
  //     age: 26,
  //     location: 'San Francisco'
  //   }, (err, result) => {
  //     if (err) {
  //       return console.log('Unable to insert user', err);
  //     }
  //     //result.ops is an array of docs that were inserted
  //     // console.log(JSON.stringify(result.ops, undefined, 2));
  //     console.log(result.ops[0]._id.getTimestamp());
  //   });

  db.close(); //disconnect from server
});
