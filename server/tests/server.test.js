const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

//dummy array of todos for testing get request
const todos = [
  {
    _id: new ObjectId(),
    text: 'First test todo',
    completed: false,
    completedAt: null
  },
  {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }
];

//clears the db for testing purposes
beforeEach((done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => {
      done();
    });
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => { //async test, so you need done
    var text = 'Test todo text';

    //remember, .expect method is supertest, expect() fn call is expect
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}) //mongoose's way to query your Todo collection
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((err) => done(err));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        //err is if we do NOT get back 400 when sending empty object
        if (err) {
          return done(err);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      //toHexString converts id obj to string
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectId().toHexString();

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var id = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
        .then((todo) => {
          expect(todo).toNotExist();
          done();
        })
        .catch((err) => {
          done(err);
        });
      });
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectId().toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var id = todos[0]._id.toHexString();
    var newText = 'new test text';

    request(app)
      .patch(`/todos/${id}`)
      .send({text: newText, completed: true})
      .expect(200)
      .expect((res) => {
        var body = res.body.todo;
        expect(body.text).toBe(newText);
        expect(body.completed).toBe(true);
        expect(body.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var id = todos[1]._id.toHexString();
    var newText = 'new test text 2';

    request(app)
      .patch(`/todos/${id}`)
      .send({text: newText, completed: false})
      .expect(200)
      .expect((res) => {
        var body = res.body.todo;
        expect(body.text).toBe(newText);
        expect(body.completed).toBe(false);
        expect(body.completedAt).toNotExist();
      })
      .end(done);
  });
});
