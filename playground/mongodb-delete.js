const {MongoClient, ObjectID} = require('mongodb'); //extract vals and create vars from mongodb object

//Our db name is TodoApp, don't need to create a db before using it. Once we name our db and add data, the db gets created
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //deleteMany
  // db.collection('Todos')
  //   .deleteMany({text: 'Eat lunch'})
  //   .then((result) => {
  //     console.log(result);
  //   });

  //deleteOne
  // db.collection('Todos')
  //   .deleteOne({text: 'Eat lunch'})
  //   .then((result) => {
  //     console.log(result);
  //   });

  //findOneAndDelete
  // db.collection('Todos')
  //   .findOneAndDelete({completed: false})
  //   .then((result) => {
  //     console.log(result);
  //   });

  //deleteMany users
  // db.collection('Users')
  //   .deleteMany({name: 'Someone'})
  //   .then((result) => {
  //     console.log(result);
  //   });

  //findOneAndDelete user by _id
  db.collection('Users')
    .findOneAndDelete({_id: new ObjectID("584a475c01085252adc68d09")})
    .then((result) => {
      console.log(result);
    });

  // db.close(); //disconnect from server
});
