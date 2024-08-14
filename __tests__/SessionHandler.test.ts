import { describe, expect } from '@jest/globals';
import SessionHandler from '../src/SessionHandler';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

describe('Session handler functions', () => {
    
  let sessionHandler: any; // type any because we are testing private methods

  beforeEach(() => {
        
    sessionHandler = new SessionHandler();
  });
    
  it('should produce a default options object if none are provided', () => {
    expect(sessionHandler.options.expiresIn).toBe('1h');
    expect(sessionHandler.options.rateLimit).toBe(10);
    expect(sessionHandler.options.rateLimitTime).toBe(60);
    expect(sessionHandler.options.blockIP).toBe(true);
    expect(sessionHandler.options.saltRounds).toBe(10);
    expect(sessionHandler.options.jwtSecret).toBe('secret');
    expect(typeof sessionHandler.options.verify).toBe('function');
  });

  it('should override default options if supplied', () => {

    const dummyOptions = {
      verify: () => 'it works!',
      expiresIn: '2h',
      rateLimit: 5,
      jwtSecret: 'Lemmiwinks',
    };
    sessionHandler.setOptions(dummyOptions);

    expect(sessionHandler.options.expiresIn).toBe('2h');
    expect(sessionHandler.options.rateLimit).toBe(5);
    expect(sessionHandler.options.rateLimitTime).toBe(60);
    expect(sessionHandler.options.blockIP).toBe(true);
    expect(sessionHandler.options.saltRounds).toBe(10);
    expect(sessionHandler.options.jwtSecret).toBe('Lemmiwinks');
    expect(typeof sessionHandler.options.verify).toBe('function');
    expect(sessionHandler.options.verify('hi', 'mom')).toBe('it works!');
  });

  xit('should return an error if options does not match typing', () => {
    // const dummyOptions = {
    //   verify: () => true,
    //   expiresIn: '2h',
    //   rateLimit: 5,
    //   jwtSecret: 3,
    // };
        




  });

});

describe('verifyUser function', () => {
  let sessionHandler : any; // type any because we are testing private methods
  const username = 'elizabeth';
  const password = 'password';
    
  beforeEach(() => {
    sessionHandler = new SessionHandler;
  });
    
  it('should provide a token once a user is verified', () => {
    
    sessionHandler.setOptions({
      verify: () => 'its working',
      jwtSecret: 'Lemmiwinks',
    });
        
    const secret = sessionHandler.options.jwtSecret;
    console.log({ secret });
    
    
    //const user = { username, role: 'user' };
    
    const result = sessionHandler.verifyUser(username, password);
    
    const checkToken = jwt.verify(result!, secret);
    
    expect(checkToken).not.toBe(undefined);
  });
    
  it('should return false if the credentials are invalid, as determined by the verify funciton', () => {
    sessionHandler.setOptions({
      verify: () => null,
      jwtSecret: 'Lemmiwinks',
    });
        
    //const secret = sessionHandler.options.jwtSecret;
    // console.log({secret})
    
    //const user = { username, role: 'user' };
    
    const result = sessionHandler.verifyUser('bad', 'eeeevil');
    
    expect(result).toBe(undefined);
  });
});

describe('verifyToken function', () => {
  let sessionHandler : any; // type any because we are testing private methods
  beforeEach(()=> {
    sessionHandler = new SessionHandler;
    sessionHandler.setOptions({
      jwtSecret: 'superSecret',
      verify : (username:string, password:string) => {
        if (username === 'Elizabeth' && password === 'elizabethPassword') {
          return 'Elizabeth';
        }
        return null;
      },
    });
  });

  it('should return false when provided an invalid token', ()=> {
    //const wrongSecret = 'bwahahahahmichaeljackson';
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVsaXphYmV0aCIsImlhdCI6MTcyMTQ5NTI0Nn0.xU5s4yqpryre2hZosWAb3SnSvBinQj3kzIMp7MGrYIk';
    const badVerify = sessionHandler.verifyToken(invalidToken);
    expect(badVerify).toBe(false);
  });

  it('should return decoded object when provided correct token', () => {
    //const secret = sessionHandler.options.jwtSecret;
    //const justSomeString = 'oajofdalfjedlafjd';
    const validToken = sessionHandler.verifyUser('Elizabeth', 'elizabethPassword');
        
    const validVerify = sessionHandler.verifyToken(`${validToken}`);
    console.log('valid verify', validVerify);


    expect(validVerify).toHaveProperty('id');
    //finish this test later lol

  });

    
});

describe('verifyUserMiddleware function', () => {
  let sessionHandler : any; // type any because we are testing private methods

  const id = 'Max';
  const password = 'veryverysecretpassword';
  const req : Partial<Request> = { body: { id, password } };
  const res : Partial<Response> = { locals: {} };
  const next = jest.fn();

  beforeEach(() => {
    sessionHandler = new SessionHandler;
    sessionHandler.setOptions({
      verify: (ID:string, pwd:string) => {
        console.log('id', id);
        console.log('password', pwd);
        if ( ID === 'Max' && pwd === 'veryverysecretpassword') {
          return 'Max';
        }
        return null;
      },
      jwtSecret: 'superSecret',
    });
  });

  it('should attach a token to the request object if the user is verified', () => {
    sessionHandler.verifyUserMiddleware(req as Request, res as Response, next);
    expect(res.locals).toHaveProperty('token');
  });
  it('should call next with an error if the user is not verified', () => {
    req.body.id = 'someInvalidNonMaxPerson';
    sessionHandler.verifyUserMiddleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('rateLimit function', () => {
  //let sessionHandler : SessionHandler;
    
});