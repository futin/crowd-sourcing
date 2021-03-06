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
      value: 'local',
    },
    {
      name: 'databases',
      value: {
        mongodb: {
          mongoServers: 'localhost:27017,localhost:27018,localhost:27019',
          username: '',
          password: '',
          connectorPath: 'mongodb.connector',
          replicaSet: 'rs0',
          // generated dynamically
          // url: 'mongodb://localhost:27017,localhost:27018,localhost:27019/crowd-source-local?replicaSet=rs0
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
        jwtSecret: "shh... it's a secret",
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
