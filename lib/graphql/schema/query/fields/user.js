// core modules

// 3rd party modules
const { GraphQLList, GraphQLString } = require('graphql');

// internal alias modules

// internal modules
const { UserType } = require('../../../models');
const { isAnyMandatoryFieldProvided } = require('../../utils');

const user = {
  type: UserType,
  description: 'Fetch single user',
  args: {
    email: { type: GraphQLString },
    username: { type: GraphQLString },
  },
  resolve: (parent, { email, username }, { connector }) => {
    if (!isAnyMandatoryFieldProvided(email, username)) {
      throw Error('Please provide either username or an email');
    }

    const query = username ? { username } : { email };
    return connector.findOne('User', query);
  },
};

const currentUser = {
  type: UserType,
  description: 'Fetch current user',
  resolve: (parent, args, context) => context.user,
};

const users = {
  type: new GraphQLList(UserType),
  description: 'Fetch list of users',
  resolve: (parent, args, { connector }) => connector.findAll('User'),
};

const activeUsers = {
  type: new GraphQLList(UserType),
  description: 'Fetch only active users',
  resolve: (parent, args, { connector }) => connector.findAll('User', { isActive: true }),
};

module.exports = {
  user,
  currentUser,
  users,
  activeUsers,
};
