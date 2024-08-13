## Table of Contents
* [Introduction](#introduction)
* [Session Handler Object](#session-handler-object)
  * [Set Options](#sessionhandlersetoptions)
  * [Verify User](#sessionhandlerverifyuser)
  * [Verify Token](#sessionhandlerverifytoken)


## Introduction
ARMOR-E Node is the backend library companion to the ARMOR-E React components. Utilizing this library will allow the user to partner middleware for authentication purposes.

To use, install both libraries through npm.

## Session Handler Object
The Session Handler Object will set the options for the authentication and allow the user to verify username/password and any created tokens.

To use the Session Handler object, require in the Session Handler object:

const sessionHandler = require('armore-node')

### sessionHandler.setOptions
By default, the session handler options are set to the following:

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

A user will be able to modify the default options by calling the setOptions method and passing in their custom options object. For example:

   sessionHandler.setOptions({
      verify: ( username, password ) => {
        if (username === 'steve' && password === 'madden') {
          return `${username}, ${password}`;
        } else {
          return null;
        }
      },
      expiresIn: '1h',
      rateLimit: 20,
      rateLimitTime: 60,
      blockIP: true,
      saltRounds: 10,
      jwtSecret: 'rupaul',
   });

The verify function in the options object will ultimately output into the verifyUser method on the Session Handler object to create a token.

### sessionHandler.verifyUser
Once the inputted information passes the verification that the user codes in (see [setOptions](#sessionhandlersetoptions)).

If the information returned is not null, verifyUser will return a JSON web token with the provided id or username. It will use the default expiresIn value in the options object. For example:

   sessionHandler.verifyUser( `${id} || ${username}`, `${password}` )

### sessionHandler.verifyToken
The Session Handler option can also verify tokens for the user. Simply pass in the created token.

   sessionHandler.verifyToken( `${token}` )

