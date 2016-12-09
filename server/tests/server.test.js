const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

//clears the db for testing purposes
beforeEach((done) => {
  Todo.remove({})
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

        Todo.find()
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
            expect(todos.length).toBe(0);
            done();
          })
          .catch((err) => done(err));
      });
  });
});
