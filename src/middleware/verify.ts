// middleware that verifies the user credentials and returns a boolean value
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';




const Verify = (req : Request, res : Response, next: NextFunction) =>{
  // confirm the user credentials from the provided jwt
  if (req.headers.authorization === 'Bearer') {
    const token : string = req.headers.authorization.split(' ')[1];
    jwt.verify(token, )// we need to get make a way to assign a secret key when the session is created
  }
};

export default Verify;