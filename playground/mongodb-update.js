const {MongoClient, ObjectID} = require('mongodb'); //extract vals and create vars from mongodb object

//Our db name is TodoApp, don't need to create a db before using it. Once we name our db and add data, the db gets created
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //findOneAndUpdate
  // db.collection('Todos')
  //   .findOneAndUpdate({
  //     _id: new ObjectID("584a62777ef584d985757d2c")
  //   }, {
  //     $set: { //$set is an update operator, need it to update doc
  //       completed: true
  //     }
  //   }, {
  //     returnOriginal: false
  //   })
  //   .then((result) => {
  //     console.log(result);
  //   });

  db.collection('Users')
    .findOneAndUpdate({
      _id: new ObjectID("584a456ed6b3e352108ab89d")
    }, {
      $inc: {
        age: +5
      },
      $set: {
        name: 'Andy'
      }
    }, {
      returnOriginal: false
    })
    .then((result) => {
      console.log(result);
    });

  // db.close(); //disconnect from server
});
