// core node modules

// 3rd party modules
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const debug = require('debug');

// internal alias modules

// internal modules

// internal modules

const {
  constants: {
    loggerNamespaces: { jwtAuthSetupNamespace },
  },
  settings: {
    authConfig: { jwtSecret, jwtStrategyName },
  },
} = require('../../config');

const logger = debug(jwtAuthSetupNamespace);

const jwtAuthMiddleware = passport => passport.authenticate(jwtStrategyName, { session: false });

const jwtAuthSetup = (passport) => {
  passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    },
    (payload, done) => {
      logger('payload received ', payload);
      return done(null, payload);
    },
  ));
};

module.exports = { jwtAuthSetup, jwtAuthMiddleware };
