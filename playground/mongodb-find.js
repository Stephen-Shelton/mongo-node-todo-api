const {MongoClient, ObjectID} = require('mongodb'); //extract vals and create vars from mongodb object

//Our db name is TodoApp, don't need to create a db before using it. Once we name our db and add data, the db gets created
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //fetch docs, convert them to array, print them to console
  // db.collection('Todos')
  //   .find({
  //     _id: new ObjectID("584a42bb58e5b150e5eb6ac8")
  //   }) //query based on doc prop/vals
  //   .toArray()
  //   .then((docs) => {
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs, undefined, 2));
  //   }, (err) => {
  //     console.log('Unable to fetch todos, err');
  //   });

  // db.collection('Todos')
  //   .find() //can query based on doc prop/vals by passing in obj as arg
  //   .count()
  //   .then((count) => {
  //     console.log(`Todos count: ${count}`);
  //   }, (err) => {
  //     console.log('Unable to fetch todos, err');
  //   });

  db.collection('Users')
    .find({name: 'Stephen'}) //can query based on doc prop/vals by passing in obj as arg
    .toArray()
    .then((docs) => {
      console.log(JSON.stringify(docs, undefined, 2));
    })
    .catch((err) => {
      console.log('Unable to fetch docs', err);
    });

  db.close(); //disconnect from server
});
