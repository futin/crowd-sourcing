// node core modules
const http = require('http');
const https = require('https');

// 3rd party modules
require('module-alias/register');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');

const debug = require('debug');

// internal alias modules

// internal modules
const { passportAuthMiddleware, graphqlMiddleware, errorMiddleware, authUserMiddleware } = require('./middlewares');
const { authRoutes } = require('./routes');
const { mongodb: { setup: setupMongoose } } = require('./databases');
const {
  settings,
  constants: {
    loggerNamespaces: {
      appNamespace,
    },
  },
} = require('./config');

const logger = debug(appNamespace);

const baseConfiguration = (app) => {
  const { sessionCookie } = settings;

  logger('Setting up the base server configuration');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieSession({
    maxAge: sessionCookie.maxAge,
    keys: [sessionCookie.key],
  }));
};

const setupCORS = (app) => {
  app.use((req, res, next) => {
    logger('Setting up CORS headers');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
    next();
  });
};

const setupPassport = (app) => {
  logger('Setting up passport...');
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
};

const setupAuthRoutes = (app) => {
  authRoutes(app);
};

const setupGraphql = (app) => {
  // always authenticate every graphql route with passport auth middleware,
  // in order to make sure that valid JWT token is provided
  app.use('/api', passportAuthMiddleware(passport), graphqlMiddleware);
  // app.use('/api', authUserMiddleware, graphqlMiddleware); // use it from the regular GraphQL browser
};

const setupErrorMiddleware = (app) => {
  app.use(errorMiddleware);
};

const initServer = (app) => {
  const {
    host, port, sslPort, sslOptions,
  } = settings;
  const server = http.createServer(app);

  server.listen(port, host, () => {
    console.log(`Server listening at http://${host}:${port}`);
  });

  if (sslOptions) {
    const secureServer = https.createServer(sslOptions, app);
    secureServer.listen(sslPort, () => {
      console.log(`Secure server listening at https://${host}:${port || sslPort}`); // eslint-disable-line no-console
    });
  }
};

// App configuration and server initialization
(() => {
  const app = express();

  setupMongoose();
  baseConfiguration(app);

  setupCORS(app);
  setupPassport(app);
  setupAuthRoutes(app);
  setupGraphql(app);
  setupErrorMiddleware(app);

  initServer(app);
})();
