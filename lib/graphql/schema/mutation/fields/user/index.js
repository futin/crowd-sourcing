// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLNonNull } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');
const { ing } = require('@utils');

// internal modules
const { UserType } = require('../../../../models');
const { userRoleValidator, pickThruthy, isAnyMandatoryFieldProvided } = require('../../../utils');
const { UserInputType } = require('./input-types');
const { isProvidedRoleValid } = require('./utils');

const addUser = {
  type: UserType,
  description: 'Add new Zilker user',
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    input: { type: UserInputType },
  },
  resolve: combineResolvers(
    userRoleValidator([roles.admin]),
    (parent, { email, username, input: { fullName, role } }, { connector }) => {
      if (role && !isProvidedRoleValid(role)) {
        throw Error('Invalid role provided. Please check documentation.');
      }

      const insertQuery = pickThruthy({
        email, username, fullName, role,
      });

      return connector.insertOne('User', insertQuery);
    },
  ),
};

const updateUser = {
  type: UserType,
  description: 'Add new Zilker user',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    input: { type: UserInputType },
  },
  resolve: combineResolvers(
    userRoleValidator([roles.admin]),
    (parent, { email, username, input: { fullName, role } }, { connector }) => {
      if (role && !isProvidedRoleValid(role)) {
        throw Error('Invalid role provided. Please check documentation.');
      }

      if (!isAnyMandatoryFieldProvided(email, username)) {
        throw Error('Please provide either username or an email');
      }

      const query = username ? { username } : { email };
      const updateFilter = pickThruthy({ fullName, role });

      return connector.findOneAndUpdate('User', query, updateFilter);
    },
  ),
};

const deleteUser = {
  type: GraphQLString,
  description: 'Delete Zilker user by username (or even email)',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
  resolve: combineResolvers(
    userRoleValidator([roles.admin]),
    async (parent, { username, email }, { connector }) => {
      if (!isAnyMandatoryFieldProvided(username, email)) {
        throw Error('Please provide either username or an email');
      }

      const deleteFilter = username ? { username } : { email };
      const [error] = await ing(connector.deleteOne('User', deleteFilter));

      return error
        ? `Unable to delete Zilker user [${username || email}]`
        : `Successfully deleted Zilker user [${username || email}]`;
    },
  ),
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
};
