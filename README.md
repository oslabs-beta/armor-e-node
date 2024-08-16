# ArmorE-node
ArmorE is an all in one authentication solution with front and back end support for robust, easy to implement authentication 

# Introduction
Armor-E Node is the backend package companion to the Armor-E frontend library. Connecting the two will allow for accompanying middleware to assist Armor-E frontend components and provide a complete, full-stack authentication process.

# Installation
You can install via npm:

Npm i armore-strategem

# Usage
To initialize Armor-E, provide configuration settings through the options object, as well at the database URL and secret keys.

Require in the strategy and library.

Declare a new strategy, passing in the necessary login/sign up information, and set up your middleware as needed.

Create routers to necessary paths, add your middleware, and pass in options object to add configurations.

# Configuration
//tbc

# API Reference
//tbc

# Examples
Const strategy = require(‘armore-strategem’)
Const armoreLibrary = require(‘armor-e’)

app.post(‘auth/login’, armoreLibrary.authenticate(strategy, { //options object
     rateLimit: {
          window: 1000 * 60 * 5, //5 min window
          limit: 100,
          banIP: true,
     }
})
)

//insert gifs etc here

# Contributing
Team Rocket Powered Hawk Eyes
Dylan
Elizabeth
Sincere
Max

# FAQ
//tbc