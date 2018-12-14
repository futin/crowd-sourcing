

module.exports = {
  settings: [
    {
      name: 'host',
      value: 'localhost',
    },
    {
      name: 'port',
      value: '3000',
    },
    {
      name: 'environment',
      value: 'dev',
    },
    {
      name: 'client',
      value: 'http://localhost:5000',
    },
    {
      name: 'databases',
      value: {
        mongodb: {
          host: 'localhost',
          port: '27017',
          username: '',
          password: '',
          connectorPath: 'mongodb.connector',
          // generated dynamically
          // url: 'mongodb://localhost:27017/crowd-source-dev
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
        expiresIn: 14 * 24 * 60 * 60, // make auth token expire in 14 days
      },
    },
    {
      name: 'sessionCookie',
      value: {
        key: '123123123',
        maxAge: 14 * 24 * 60 * 60 * 1000, // make cookie expire in 14 days (in milliseconds)
      },
    },
    {
      name: 'nominationConfig',
      value: {
        numberOfPointsPerMonth: 10,
      },
    },
  ],
};
