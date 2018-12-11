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

  // mongodb models
  nominationModelNamespace: 'crowd-sourcing:databases:mongodb:models:nomination-model',

  // GraphQL resolvers
  nominationMonthUniquenessNamespace: 'crowd-sourcing:graphql:schema:mutation:fields:nomination',
};

module.exports = loggerNamespaces;
