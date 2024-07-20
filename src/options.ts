// this will be a template for an options object
// when the user creates a new auth strategy
// this will be used to configure the strategy
// with options such as the ability to automate hashing of passwords, rate limiting, etc.
import { Secret } from 'jsonwebtoken';
interface Options {
  verify: (id: string, password: string) => string | null;
  jwtSecret: Secret; // secret for the JWT token
  expiresIn?: string;
  rateLimit?: number; // number of requests allowed in a certain time frame
  rateLimitTime?: number; // in seconds, defaults to 1 minute
  blockIP?: boolean; // block the IP address of the user after a certain number of failed attempts
  saltRounds?: number; // number of rounds to hash the password
}

export default Options;
