// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLNonNull } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');
const { ing } = require('@utils');

// internal modules
const { UserType } = require('../../../../models');
const { UserInputType } = require('./input-types');
const { isProvidedRoleValid } = require('./utils');
const {
  roleValidatorResolver, pickThruthy, isAnyMandatoryFieldProvided, isOwnerResolver,
} = require('../../../utils');

const addUser = {
  type: UserType,
  description: 'Add manually user to the app.',
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    input: { type: UserInputType },
  },
  resolve: combineResolvers(
    roleValidatorResolver([roles.admin]),
    (parent, { email, username, input: { fullName, role, pointsToAssign } }, { connector }) => {
      if (role && !isProvidedRoleValid(role)) {
        throw Error('Invalid role provided. Please check documentation.');
      }

      const insertQuery = pickThruthy({
        email, username, fullName, role, pointsToAssign,
      });

      return connector.insertOne('User', insertQuery);
    },
  ),
};

const updateUser = {
  type: UserType,
  description: 'Update current user. Find user by an email or username. Only fullName can be updated.',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
  },
  resolve: combineResolvers(
    isOwnerResolver,
    (parent, { email, username, fullName }, { connector }) => {
      if (!isAnyMandatoryFieldProvided(email, username)) {
        throw Error('Please provide either username or an email');
      }

      const query = username ? { username } : { email };
      const updateData = pickThruthy({ fullName });

      return connector.findOneAndUpdate('User', query, updateData);
    },
  ),
};

const updateUserRole = {
  type: UserType,
  description: 'Update current user\'s role. Find user by an email or username.',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: new GraphQLNonNull(GraphQLString), description: 'Can be either "user" or "admin"' },
  },
  resolve: combineResolvers(
    roleValidatorResolver([roles.admin]),
    (parent, { email, username, role }, { connector }) => {
      if (role && !isProvidedRoleValid(role)) {
        throw Error('Invalid role provided. Please check documentation.');
      }

      if (!isAnyMandatoryFieldProvided(email, username)) {
        throw Error('Please provide either username or an email');
      }

      const query = username ? { username } : { email };
      const updateData = pickThruthy({ role });

      return connector.findOneAndUpdate('User', query, updateData);
    },
  ),
};

const deleteUser = {
  type: GraphQLString,
  description: 'Delete user by username or email',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
  resolve: combineResolvers(
    roleValidatorResolver([roles.admin]),
    async (parent, { username, email }, { connector }) => {
      if (!isAnyMandatoryFieldProvided(username, email)) {
        throw Error('Please provide either username or an email');
      }

      const deleteFilter = username ? { username } : { email };
      const [error] = await ing(connector.deleteOne('User', deleteFilter));

      return error
        ? `Unable to delete user [${username || email}]`
        : `Successfully deleted user [${username || email}]`;
    },
  ),
};

module.exports = {
  addUser,
  updateUser,
  updateUserRole,
  deleteUser,
};
