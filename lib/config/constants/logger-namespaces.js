/* eslint-disable max-len */

// List of namespaces used with debug module
const loggerNamespaces = {
  // App level namespace
  appNamespace: 'crowd-sourcing:app',
  mongodbSetupNamespace: 'crowd-sourcing:database:setup',

  // Services
  userServiceNamespace: 'crowd-sourcing:services:user-service',
  verifyEmailServiceNamespace: 'crowd-sourcing:services:verify-email-service',

  // Settings
  settingsNamespace: 'crowd-sourcing:settings',

  // Middleware
  errorMiddlewareNamespace: 'crowd-sourcing:middlewares:error-middleware',
  authMiddlewaresNamespace: 'crowd-sourcing:middlewares:auth-middlewares',
  jwtAuthSetupNamespace: 'crowd-sourcing:middlewares:auth-middlewares:passport-jwt',
  cookieAuthSetupNamespace: 'crowd-sourcing:middlewares:auth-middlewares:passport-cookie',

  // Connectors
  mongodbConnectorNamespace: 'crowd-sourcing:databases:mongodb:connector',
  updateNominationTransactionNamespace:
    'crowd-sourcing:databases:mongodb:connector:transactions:nominations:update-nomination-transaction',
  insertNominationTransactionNamespace:
    'crowd-sourcing:databases:mongodb:connector:transactions:nominations:insert-nomination-transaction',

  // mongodb models
  nominationModelNamespace: 'crowd-sourcing:databases:mongodb:models:nomination-model',
  mongodbModelsUtilsNamespace: 'crowd-sourcing:databases:mongodb:models:utils',

  // mongodb hooks
  nomineeHooks: 'crowd-sourcing:databases:mongodb:models:hooks:nominee-hooks',

  // GraphQL resolvers
  addNominationUtilsNamespace: 'crowd-sourcing:graphql:schema:mutation:fields:nomination:utils:add-nomination-utils',
  updateNominationUtilsNamespace:
    'crowd-sourcing:graphql:schema:mutation:fields:nomination:utils:update-nomination-utils',
};

module.exports = loggerNamespaces;
