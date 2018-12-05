'use strict';

// node core modules

// 3rd party modules

// internal modules

// List of namespaces used with debug module
const loggerNamespaces = {
  // App level namespace
  appNamespace: 'crowd-sourcing:app',

  // Controllers
  userControllerNamespace: 'crowd-sourcing:controllers:user-controller',
  categoryControllerNamespace: 'crowd-sourcing:controllers:category-controller',
  nominationControllerNamespace: 'crowd-sourcing:controllers:nomination-controller',
  handleControllerNamespace: 'crowd-sourcing:controllers:handle-controller',
  profileControllerNamespace: 'crowd-sourcing:controllers:profile-controller',

  // Services
  userServiceNamespace: 'crowd-sourcing:services:user-service',
  categoryServiceNamespace: 'crowd-sourcing:services:category-service',
  nominationServiceNamespace: 'crowd-sourcing:services:nomination-service',
  handleServiceNamespace: 'crowd-sourcing:services:handle-service',
  profileServiceNamespace: 'crowd-sourcing:services:profile-service',
  verifyEmailServiceNamespace: 'crowd-sourcing:services:verify-email-service',
  filterServiceNamespace: 'crowd-sourcing:services:filter-service',

  // Settings
  settingsNamespace: 'crowd-sourcing:settings',

  // Middleware
  googleAuthSetupNamespace: 'crowd-sourcing:middleware:passport-auth-setup:google-auth-setup',
  jwtAuthSetupNamespace: 'crowd-sourcing:middleware:passport-auth-setup:jwt-auth-setup',
  jwtAuthMiddlewareNamespace: 'crowd-sourcing:middleware:jwt-auth-middleware',
  queryParserNamespace: 'crowd-sourcing:middleware:query-parser',
};

module.exports = loggerNamespaces;
