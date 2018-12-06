// core node modules

// 3rd party modules
const passport = require('passport');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

// internal modules
const { settings } = require('../config');
const { isEmailValid } = require('../services/email-validator');
const userService = require('../services/user-service');
const { ing } = require('../utils/promise-helper');

const {
  authConstants: {
    AUTH_ROUTE,
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
  passport.use(new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: redirectUrl,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile),
  ));

  app.get(
    `/${AUTH_ROUTE}`,
    passport.authenticate(GOOGLE_STRATEGY_NAME, {
      hd: DOMAIN_NAME,
      propmt: 'select_account',
      scope: ['profile', 'email'],
    }),
  );

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

      // all good!!!
      res.redirect('/api/graphiql');
    },
  );

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
