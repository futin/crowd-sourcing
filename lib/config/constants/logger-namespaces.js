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

  // Connectors
  mongodbConnector: 'crowd-sourcing:databases:mongodb:connector',

  // mongodb models
  nominationModel: 'crowd-sourcing:databases:mongodb:models:nomination-model',
};

module.exports = loggerNamespaces;
