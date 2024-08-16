import express, { Application } from 'express';
import request from 'supertest';
import { describe, expect } from '@jest/globals';
import { Server } from 'http';

import SessionHandler from '../src/SessionHandler';




// { // sample request body for a login request
//   username: string,
//   password: string,
//   email: string,
//   phoneNumber: string,
//   }


let app: Application;
let server: Server;
let sessionHandler: SessionHandler;



beforeAll(() => {
  app = express();
  sessionHandler = new SessionHandler();

  app.post('/login', sessionHandler.getVerifyUserMiddleware(), (req, res) => {
    res.send({ token: res.locals.token });
  });

  app.use((req, res) => {
    res.status(404).send('Not Found');
  });

  server = app.listen(8080, () => {
    console.log('Server is running on port 8080');
  });
});

afterAll( (done) => {
  server.close(done);
  return;
});

beforeEach(()=> {
  sessionHandler = new SessionHandler();
  sessionHandler.setOptions({
    jwtSecret: 'ultraSecret',
    verify: (id, password) => {
      if (id === 'whatIsAMan' && password === 'aMiserablePileOfSecrets') {
        return 'Alucard';
      } else {
        return null;
      }
    },
  });
});



describe('verifyUser middleware function', () => {

  it('should return a token if the verify function returns a value', async () => {
    request(app)
      .post('/login')
      .send( { id: 'whatIsAMand', password: 'aMiserablePileOfSecrets' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((res) => {
        console.log('res.body', res.body);
        expect(res.body).toHaveProperty('token');
      })
      .end((err) => {
        if (err) {
          console.error('Error');
          //throw err;
        }
      });

  });
});

