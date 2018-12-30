// core node modules

// 3rd party modules
const debug = require('debug');

// internal alias modules

// internal modules
const {
  constants: {
    loggerNamespaces: { errorMiddlewareNamespace },
  },
  settings: { environment },
} = require('../config');

const logger = debug(errorMiddlewareNamespace);

const devMode = /dev|local/.test(environment);

module.exports = (err, req, res, next) => {
  // log the error anyways
  logger(err);

  if (devMode) {
    // let default error handle intervene
    next(err);
    return;
  }

  res.status(500).send({ error: 'Oops... Something went wrong' });
};
