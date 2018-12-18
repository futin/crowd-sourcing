// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');

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

      return connector.insertOne('User', { ...insertQuery, isActive: true });
    },
  ),
};

const updateUser = {
  type: UserType,
  description: 'Update current user. Find user by an email or username. Only fullName and url can be updated.',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
  },
  resolve: combineResolvers(
    isOwnerResolver,
    (parent, args, { connector }) => {
      const {
        email, username, fullName, imageUrl,
      } = args;
      if (!isAnyMandatoryFieldProvided(email, username)) {
        throw Error('Please provide either username or an email');
      }

      const query = username ? { username } : { email };
      const updateData = pickThruthy({ fullName, imageUrl });

      return connector.findOneAndUpdate('User', query, updateData);
    },
  ),
};

const updateUserAdvance = {
  type: UserType,
  description: 'Update current user\'s role or activity status. Find user by an email or username.',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString, description: 'Can be either "user" or "admin"' },
    isActive: { type: GraphQLBoolean, description: 'Is user still active' },
  },
  resolve: combineResolvers(
    roleValidatorResolver([roles.admin]),
    (parent, args, { connector }) => {
      const {
        email, username, role, isActive,
      } = args;
      if (role && !isProvidedRoleValid(role)) {
        throw Error('Invalid role provided. Please check documentation.');
      }

      if (!isAnyMandatoryFieldProvided(email, username)) {
        throw Error('Please provide either username or an email');
      }

      const query = username ? { username } : { email };
      const updateData = pickThruthy({ role, isActive });

      return connector.findOneAndUpdate('User', query, updateData);
    },
  ),
};

module.exports = {
  addUser,
  updateUser,
  updateUserAdvance,
};
