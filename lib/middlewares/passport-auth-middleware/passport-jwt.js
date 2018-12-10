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
    authConstants: { JWT_SECRET, JWT_STRATEGY_NAME },
  },
} = require('../../config');

const logger = debug(jwtAuthSetupNamespace);

const jwtAuthMiddleware = passport => passport.authenticate(JWT_STRATEGY_NAME, { session: false });

const jwtAuthSetup = (passport) => {
  passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    (payload, done) => {
      logger('payload received ', payload);
      return done(null, payload);
    },
  ));
};

module.exports = { jwtAuthSetup, jwtAuthMiddleware };
