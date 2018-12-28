const {
  MONGO_SERVERS: mongoServers,
  MONGO_USERNAME: mongoUsername,
  MONGO_PASSWORD: mongoPassword,
} = process.env;

module.exports = {
  settings: [
    {
      name: 'host',
      value: '0.0.0.0',
    },
    {
      name: 'port',
      value: '3001',
    },
    {
      name: 'environment',
      value: 'dev',
    },
    {
      name: 'databases',
      value: {
        mongodb: {
          mongoServers,
          username: mongoUsername,
          password: mongoPassword,
          connectorPath: 'mongodb.connector',
          replicaSet: 'rs0',
          // generated dynamically
          // url: 'mongodb://{mongoServers}/crowd-source-local
        },
      },
    },
    {
      name: 'googleStrategy',
      value: {
        clientId: '789638623262-fm600fcdp3lausc8eovm34sd1654vufb.apps.googleusercontent.com',
        clientSecret: 's6qKkGa87jdT9i1Y-lGoqTV0',
        redirectUrl: 'http://local.crowd-sourcing.com/auth/google/redirect',
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
    {
      name: 'transactionConfig',
      value: {
        maxAttempts: 5,
        timeout: 500,
      },
    },
  ],
};
