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
    });

    it('should provide a token once a user is verified', () => {

        const username = 'elizabeth';
        const password = 'password';
    })
})