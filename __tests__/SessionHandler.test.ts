import { describe, expect, test } from '@jest/globals';
import SessionHandler from '../src/SessionHandler';
import jwt from 'jsonwebtoken';
import Options from '../src/options';

describe("Session handler functions", () => {
    
    let sessionHandler: SessionHandler;

    beforeEach(() => {
        
        sessionHandler = new SessionHandler();
    })
    
    it('should produce a default options object if none are provided', () => {
        expect(sessionHandler['options'].expiresIn).toBe('1h');
        expect(sessionHandler['options'].rateLimit).toBe(10);
        expect(sessionHandler['options'].rateLimitTime).toBe(60);
        expect(sessionHandler['options'].blockIP).toBe(true);
        expect(sessionHandler['options'].saltRounds).toBe(10);
        expect(sessionHandler['options'].jwtSecret).toBe('secret');
        expect(typeof sessionHandler['options'].verify).toBe('function');
    });

    it('should override default options if supplied', () => {

        const dummyOptions = {
            verify: () => 'it works!',
            expiresIn: '2h',
            rateLimit: 5,
            jwtSecret: 'Lemmiwinks'
        };
        sessionHandler.setOptions(dummyOptions);

        expect(sessionHandler['options'].expiresIn).toBe('2h');
        expect(sessionHandler['options'].rateLimit).toBe(5);
        expect(sessionHandler['options'].rateLimitTime).toBe(60);
        expect(sessionHandler['options'].blockIP).toBe(true);
        expect(sessionHandler['options'].saltRounds).toBe(10);
        expect(sessionHandler['options'].jwtSecret).toBe('Lemmiwinks');
        expect(typeof sessionHandler['options'].verify).toBe('function');
        expect(sessionHandler['options'].verify('hi', 'mom')).toBe('it works!');
    });

});

describe('verifyUser function', () => {
    let sessionHandler : SessionHandler;
    const username = 'elizabeth';
    const password = 'password';
    
    beforeEach(() => {
        sessionHandler = new SessionHandler
    });
    
    it('should provide a token once a user is verified', () => {
    
        sessionHandler.setOptions({
            verify: () => 'its working',
            jwtSecret: 'Lemmiwinks'
        });
        
        const secret = sessionHandler['options'].jwtSecret;
        console.log({secret})
    
    
        const user = { username, role: 'user' };
    
        const result = sessionHandler.verifyUser(username, password);
    
        const checkToken = jwt.verify(result!, secret)
    
        expect(checkToken).not.toBe(undefined);
    });
    
    it('should return false if the credentials are invalid, as determined by the verify funciton', () => {
        sessionHandler.setOptions({
            verify: () => null,
            jwtSecret: 'Lemmiwinks'
        });
        
        const secret = sessionHandler['options'].jwtSecret;
        console.log({secret})
    
        const user = { username, role: 'user' };
    
        const result = sessionHandler.verifyUser('bad', 'eeeevil');
    
        expect(result).toBe(undefined);
    });
})

describe("verifyToken function", () => {
    let sessionHandler : SessionHandler
    beforeEach(()=> {
        sessionHandler = new SessionHandler
        sessionHandler.setOptions({
            jwtSecret: 'superSecret',
            verify : (username, password) => {
                if (username === 'Elizabeth' && password ==='elizabethPassword'){
                    return 'Elizabeth'
                }
                return null;
            }
        })
    })

    it('should return false when provided an invalid token', ()=> {
        const wrongSecret = 'bwahahahahmichaeljackson';
        const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVsaXphYmV0aCIsImlhdCI6MTcyMTQ5NTI0Nn0.xU5s4yqpryre2hZosWAb3SnSvBinQj3kzIMp7MGrYIk'
        const badVerify = sessionHandler.verifyToken(invalidToken);
        expect(badVerify).toBe(false);
    })

    
})