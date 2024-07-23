//main entry point for the application
import { NextFunction, Request, Response } from 'express';
import Options from './options';
import jwt from 'jsonwebtoken';


class SessionHandler { 
  private options: Options;

  private history: Map<string, [Date, number]> = new Map(); // history of requests from an IP address

  constructor() {
    this.options = {
      // maybe include a customizable user object here
      // also a customizable user database, such as a MongoDB connection
      // otherwise, the user will have to implement their own database connection,
      // look into express-rate-limit
      verify: () => {        
        return null;
      },
      expiresIn: '1h',
      rateLimit: 10,
      rateLimitTime: 60,
      blockIP: true,
      saltRounds: 10,
      jwtSecret: 'secret',
    };
    
  }

  public setOptions(options: Options) {
    // first, check to make sure there are no invalid or undefined options
    if (options.rateLimitTime === undefined || options.rateLimitTime < 0 || !Number.isInteger(options.rateLimitTime)) {
      throw new Error('Invalid rate limit time');
    }
    if (options.rateLimit === undefined || options.rateLimit < 0 || !Number.isInteger(options.rateLimit)) {
      throw new Error('Invalid rate limit');
    }
    if (options.expiresIn === undefined) {
      throw new Error('Invalid expiration time');
    }
    if (options.verify === undefined) {
      throw new Error('Invalid verify function');
    }
    if (options.jwtSecret === undefined) {
      throw new Error('Invalid JWT secret');
    }
    if (options.saltRounds === undefined || options.saltRounds < 0 || !Number.isInteger(options.saltRounds)) {
      throw new Error('Invalid salt rounds');
    }
    // if all options are valid, assign them to the options object
    Object.assign(this.options, options);
  }

  public verifyUser(id: string, password: string) {
    if (this.options.verify(id, password) !== null) {
      return jwt.sign({ id }, this.options.jwtSecret, { expiresIn: this.options.expiresIn || '1h' });
    }
  }

  public verifyUserMiddleware(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;
    const password = req.body.password;
    if (this.options.verify(username, password) !== null) {
      return next();
    } else {
      throw new Error('Invalid username or password');
    }

  }

  public verifyToken(token: string) {
    try {
      return jwt.verify(token, this.options.jwtSecret);
    } catch (err) {
      return false;
    }
  }

  public verifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
      if (this.verifyToken(token)) {
        return next();
      }
    }
    return res.status(401).send('Unauthorized');
  }

  private rateLimitCheck(ip: string) {
    const [date, count] = this.history.get(ip) || [new Date(), 0];
    if (new Date().getTime() - date.getTime() > this.options.rateLimitTime! * 1000) {
      this.history.set(ip, [new Date(), 1]);
    } else {
      this.history.set(ip, [date, count + 1]);
    }
  }

  public rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || 'NO_IP';
    this.rateLimitCheck(ip);
    if (this.history.get(ip)![1] > this.options.rateLimit!) {
      return res.status(429).send('Too many requests');
    }
    return next();
  }
}



export default SessionHandler;
