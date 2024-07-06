//main entry point for the application
import Options from './options';
import jwt from 'jsonwebtoken';


class SessionHandler {
  private options: Options;

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
    Object.assign(this.options, options);
  }

  public verifyUser(id: string, password: string) {
    if (this.options.verify(id, password) !== null) {
      return jwt.sign({ id }, this.options.jwtSecret, { expiresIn: this.options.expiresIn || '1h' });
    }
  }

  public verifyToken(token: string) {
    try {
      return jwt.verify(token, this.options.jwtSecret);
    } catch (err) {
      return false;
    }
  }

}




export default SessionHandler;
