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
const handleService = require('../services/handle-service');

const logger = debug(verifyEmailServiceNamespace);

const isEmailValid = (email) => {
  const [handleName, domain] = email.split('@');

  if (domain !== DOMAIN_NAME) {
    logger(`Domain name used for registration is not ${DOMAIN_NAME}`);
    return Promise.reject(new Error('Domain name used for registration is not allowed'));
  }

  return handleService.isHandleValid(handleName);
};

module.exports = {
  isEmailValid,
};
