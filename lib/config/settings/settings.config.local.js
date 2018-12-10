module.exports = {
  settings: [
    {
      name: 'host',
      value: 'localhost',
    },
    {
      name: 'port',
      value: '3001',
    },
    {
      name: 'environment',
      value: 'local',
    },
    {
      name: 'client',
      value: 'http://localhost:5000',
    },
    {
      name: 'databases',
      value: {
        mongodb: {
          url: 'mongodb://localhost:27017/crowd-source-local',
          connectorPath: 'mongodb.connector',
        },
      },
    },
    {
      name: 'googleStrategy',
      value: {
        clientId: '789638623262-fm600fcdp3lausc8eovm34sd1654vufb.apps.googleusercontent.com',
        clientSecret: 's6qKkGa87jdT9i1Y-lGoqTV0',
      },
    },
    {
      name: 'authConfig',
      value: {
        authRoute: 'auth/google',
        googleStrategyName: 'google',
        domainName: 'ztech.io',
        callbackUrl: 'auth/google/redirect',
        jwtSecret: 'shh... it\'s a secret',
        jwtStrategyName: 'jwt',
        expiresIn: 24 * 60 * 60,
      },
    },
    {
      name: 'sessionCookie',
      value: {
        key: '123123123',
        maxAge: 24 * 60 * 60 * 1000,
      },
    },
  ],
};
