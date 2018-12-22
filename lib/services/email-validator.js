// node core modules

// 3rd party modules
const debug = require('debug');

// internal alias modules

// internal modules
const {
  constants: {
    loggerNamespaces: { verifyEmailServiceNamespace },
  },
  settings: {
    authConfig: {
      domainName,
    },
  },
} = require('../config');
const { isUserAuthorized } = require('./user-service');

const logger = debug(verifyEmailServiceNamespace);

const emailValidator = {
  isEmailValid: (email) => {
    const [username, domain] = email.split('@');

    if (domain !== domainName) {
      logger(`Domain name used for registration is not ${domainName}`);
      return Promise.reject(new Error('Domain name used for registration is not allowed'));
    }

    return isUserAuthorized(username);
  },
};

module.exports = emailValidator;
