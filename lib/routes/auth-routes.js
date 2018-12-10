// core node modules

// 3rd party modules
const passport = require('passport');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const jwt = require('jsonwebtoken');

// internal alias modules

// internal modules
const { authUserMiddleware } = require('../middlewares');
const { settings } = require('../config');
const { isEmailValid } = require('../services/email-validator');
const userService = require('../services/user-service');
const { ing } = require('../utils/promise-helper');

const {
  authConstants: {
    AUTH_ROUTE,
    JWT_SECRET,
    GOOGLE_STRATEGY_NAME,
    DOMAIN_NAME,
    CALLBACK_URL,
  },
  googleStrategy: {
    clientId: clientID,
    clientSecret,
    redirectUrl,
  },
} = settings;

module.exports = (app) => {
  // attach google strategy
  passport.use(new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: redirectUrl,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile),
  ));

  // handle auth route, and authenticate with provided configurations
  app.get(
    `/${AUTH_ROUTE}`,
    passport.authenticate(GOOGLE_STRATEGY_NAME, {
      hd: DOMAIN_NAME,
      propmt: 'select_account',
      scope: ['profile', 'email'],
    }),
  );

  // Once google has done with authentication, handle response by validating email address
  app.get(
    `/${CALLBACK_URL}`,
    passport.authenticate(GOOGLE_STRATEGY_NAME),
    async (req, res, next) => {
      const { user } = req;
      const { emails } = user;

      const [email] = emails;
      const [emailError, validEmail] = await ing(isEmailValid(email.value));

      if (emailError) {
        // let error middlewares handle errors
        next(emailError);
        return;
      }

      if (!validEmail) {
        // if email is invalid, logout user immediately
        // in order to try with a different account
        req.logout();
        next(new Error(`Email ${email.value} is not allowed to login. Please contact administrator`));
        return;
      }

      const [userCreationError] = await ing(userService.findOrCreateUser(user));

      if (userCreationError) {
        next(userCreationError);
        return;
      }

      res.redirect('/api/graphiql');
    },
  );

  // retrieve auth token by calling this route. Auth token can be acquired only by
  // successfully logged in user. That when authUserMiddleware comes into play.
  app.get('/auth-token', authUserMiddleware, (req, res) => {
    const accessToken = jwt.sign(JSON.stringify(req.user), JWT_SECRET);
    res.send({ data: { status: 200, accessToken } });
  });

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
