'use strict';

// node core modules

// 3rd party modules
const debug = require('debug');

// internal modules
const {
  constants: {
    loggerNamespaces: { verifyEmailServiceNamespace },
  },
  settings: {
    authConstants: {
      DOMAIN_NAME,
    },
  },
} = require('../config');
const { isUserAuthorized } = require('../services/user-service');

const logger = debug(verifyEmailServiceNamespace);

const isEmailValid = (email) => {
  const [username, domain] = email.split('@');

  if (domain !== DOMAIN_NAME) {
    logger(`Domain name used for registration is not ${DOMAIN_NAME}`);
    return Promise.reject(new Error('Domain name used for registration is not allowed'));
  }

  return isUserAuthorized(username);
};

module.exports = {
  isEmailValid,
};
