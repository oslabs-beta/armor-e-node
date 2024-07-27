import express, { Application } from 'express';
import request from 'supertest';
import { describe, expect } from '@jest/globals';

import SessionHandler from '../src/SessionHandler';


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
    app.post('/login', sessionHandler.getVerifyUserMiddleware());
    // const response = await request(app);
    //const result = await response.send()
  });
});