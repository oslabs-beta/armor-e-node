//main entry point for the application
import Options from './options';

class Strategy {
  private options: Options;

  constructor(options: Options) {
    this.options = {
      // maybe include a customizable user object here
      // also a customizable user database, such as a MongoDB connection
      // otherwise, the user will have to implement their own database connection,
      // look into express-rate-limit
      verify: (username: string, password: string) => {
        return false;
      },
      rateLimit: 10,
      rateLimitTime: 60,
      blockIP: true,
      saltRounds: 10,
    };
  }

  public setOptions(options: Options) {
    Object.assign(this.options, options);
  }

  public verify(username: string, password: string, ip: string) {
    if (this.options.blockIP) {
      // check if the IP address is blocked
      // if it is, return an error
    }
  }
}

export default Strategy;
