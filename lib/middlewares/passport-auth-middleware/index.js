// core node modules

// 3rd party modules

// internal alias modules

// internal modules
const { jwtAuthSetup, jwtAuthMiddleware } = require('./passport-jwt');

const passportAuthMiddleware = (passport) => {
  // setup jwt for Auth Token usage
  jwtAuthSetup(passport);

  return jwtAuthMiddleware(passport);
};

module.exports = passportAuthMiddleware;
