// core node modules

// 3rd party modules
const graphqlHTTP = require('express-graphql');
const _ = require('lodash');

// internal alias modules
const databaseConnectors = require('@databases');
const {
  settings: {
    environment,
    databases: {
      mongodb: {
        connectorPath,
      },
    },
  },
} = require('@config');
const { ing } = require('@utils');

// internal modules
const schema = require('../graphql');

module.exports = async (req, res, next) => {
  const { user } = req;

  const connector = _.get(databaseConnectors, connectorPath);
  const [error, dbUser] = await ing(connector.findOne('User', { username: user.username }));

  if (error) {
    return next(error);
  }

  // This can only happen if admin removes user from the database, but user's access token hasn't expire yet
  // Since access tokens are not persisted, this unauthenticated http requests are rejected
  if (!dbUser) {
    req.logout();
    return res.status(401).send({ message: `Unauthenticated request by ${user.username}. Please re-login.` });
  }

  return graphqlHTTP({
    schema,
    // only display graphiql interface while not in production
    graphiql: ['dev', 'local'].includes(environment),
    context: {
      // this is an actual user retrieved from the database
      user,
      connector,
    },
  })(req, res, next);
};
