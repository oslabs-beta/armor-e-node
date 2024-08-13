import express, { Application } from 'express';
import request from 'supertest';
import { describe, expect } from '@jest/globals';

import SessionHandler from '../src/SessionHandler';




// { // sample request body for a login request
//   username: string,
//   password: string,
//   email: string,
//   phoneNumber: string,
//   }


describe('verifyUser middleware function', ()=>{
  let app: Application;
  let sessionHandler: SessionHandler;

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
    app = express();
  });

  it('should return a token if the verify function returns a value', async () => {
    request(app)
      .post('/login')
      .send( { id: 'whatIsAMand', password: 'aMiserablePileOfSecrets' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
      });

  });
});

