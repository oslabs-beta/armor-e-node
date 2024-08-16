//main entry point for the application
import { NextFunction, Request, Response } from 'express';
import Options from './options';
import jwt from 'jsonwebtoken';
import express from 'express';



class SessionHandler { 
  private options: Options;

  private history: Map<string, [Date, number]> = new Map(); // history of requests from an IP address

  constructor() {
    this.options = {
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
      if (options.rateLimitTime === undefined) {
        delete options.rateLimitTime;
      } else {
        throw new Error('Invalid rate limit time');
      }
    }
    if (options.rateLimit === undefined || options.rateLimit < 0 || !Number.isInteger(options.rateLimit)) {
      if (options.rateLimit === undefined) {
        delete options.rateLimit;
      } else {
        throw new Error('Invalid rate limit');
      }
    }
    if (options.expiresIn === undefined) {
      if (options.expiresIn === undefined) {
        delete options.expiresIn;
      } else {
        throw new Error('Invalid expiration time');
      }
    }
    if (options.verify === undefined) {
      throw new Error('Invalid verify function');
    }
    if (options.jwtSecret === undefined) {
      throw new Error('Invalid JWT secret');
    }
    if (options.saltRounds === undefined || options.saltRounds < 0 || !Number.isInteger(options.saltRounds)) {
      if (options.saltRounds === undefined) {
        delete options.saltRounds;
      } else {
        throw new Error('Invalid salt rounds');
      }
    }
    // if all options are valid, assign them to the options object
    Object.assign(this.options, options);
  }

  private verifyUser(id: string, password: string) {
    if (this.options.verify(id, password) !== null) {
      return jwt.sign({ id }, this.options.jwtSecret, { expiresIn: this.options.expiresIn || '1h' });
    }
  }

  private verifyUserMiddleware(req: Request, res: Response, next: NextFunction) {
    
    const username = req.body.id;
    const password = req.body.password;
    console.log('username, password', username, password);
    const token = this.options.verify(username, password);
    console.log({ token });
    if (token !== null) {
      res.locals.token = token;
      return next();
    } else {
      next(new Error('Invalid username or password'));
    }

  }

  private bodyParseCheck(req: Request, res: Response, next: NextFunction) {
    if (req.body && Object.keys(req.body).length > 0) {
      return next();
    }
    express.text()(req, res, next);
  }

  public getVerifyUserMiddleware() {
    const router = express.Router();
    router.use(this.bodyParseCheck.bind(this));
    router.use(this.verifyUserMiddleware.bind(this));
    return router;
  }

  private verifyToken(token: string) {
    try {
      return jwt.verify(token, this.options.jwtSecret);
    } catch (err) {
      return false;
    }
  }

  private verifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
      if (this.verifyToken(token)) {
        return next();
      }
    }
    return res.status(401).send('Unauthorized');
  }

  public getVerifyTokenMiddleware() {
    const router = express.Router();
    router.use(this.verifyTokenMiddleware.bind(this));
    return router;
  }

  private rateLimitCheck(ip: string) {
    const [date, count] = this.history.get(ip) || [new Date(), 0];
    if (new Date().getTime() - date.getTime() > this.options.rateLimitTime! * 1000) {
      this.history.set(ip, [new Date(), 1]);
    } else {
      this.history.set(ip, [date, count + 1]);
    }
  }

  private rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || 'NO_IP';
    this.rateLimitCheck(ip);
    if (this.history.get(ip)![1] > this.options.rateLimit!) {
      return res.status(429).send('Too many requests');
    }
    return next();
  }

  public getRateLimitMiddleware() {
    const router = express.Router();
    router.use(this.rateLimitMiddleware.bind(this));
    return router;
  }
}



export default SessionHandler;
