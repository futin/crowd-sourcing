'use strict';

// core node modules

// 3rd party modules
const passport = require('passport');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

// internal modules
const { settings } = require('../config');

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
    (accessToken, refreshToken, profile, done) => done(null, profile)
  ));

  app.get(
    `/${AUTH_ROUTE}`,
    passport.authenticate(GOOGLE_STRATEGY_NAME, {
      hd: DOMAIN_NAME,
      propmt: 'select_account',
      scope: ['profile', 'email'],
    })
  );

  app.get(
    `/${CALLBACK_URL}`,
    passport.authenticate(GOOGLE_STRATEGY_NAME),
    (req, res) => {
      const { user } = req;
      // TODO: validate user's email
      res.redirect('/dashboard');
    }
  );

  // app.get('/auth/logout', (req, res) => {
  //   req.logout();
  //   res.redirect('/');
  // });
};
