'use strict';

module.exports = {
  settings: [
    {
      name: 'host',
      value: 'localhost',
    },
    {
      name: 'port',
      value: '5000',
    },
    {
      name: 'environment',
      value: 'prod',
    },
    {
      name: 'client',
      value: 'http://localhost:5000',
    },
    {
      name: 'dbUrl',
      value: 'mongodb://localhost:27017/crowd-source-prod',
    },
    {
      name: 'googleStrategy',
      value: {
        clientId: '789638623262-fm600fcdp3lausc8eovm34sd1654vufb.apps.googleusercontent.com',
        clientSecret: 's6qKkGa87jdT9i1Y-lGoqTV0',
      },
    },
    {
      name: 'authConstants',
      value: {
        AUTH_ROUTE: 'auth-google',
        GOOGLE_STRATEGY_NAME: 'google',
        DOMAIN_NAME: 'ztech.io',
        CALLBACK_URL: 'auth/google/redirect',
      },
    },
    {
      name: 'sessionCookie',
      value: {
        key: '123123123',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    },
  ],
};
