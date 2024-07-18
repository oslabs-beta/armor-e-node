import { Request, Response, NextFunction } from 'express';
import jws, { Jwt, Secret } from 'jsonwebtoken';

const createSessionToken = (req: Request, res: Response, next: NextFunction) => {
  // create a session token for the user
  const secret: Secret = '';
  const token: string = jws.sign({ id: req.body.user.id }, secret);
  res.locals.token = token;
  res.cookie('jwt', token);
  next();
};

export default createSessionToken;