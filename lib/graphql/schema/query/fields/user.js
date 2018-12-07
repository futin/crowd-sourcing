// core modules

// 3rd party modules
const { GraphQLList, GraphQLString } = require('graphql');

// internal alias modules

// internal modules
const { UserType } = require('../../../models');
const { isAnyMandatoryFieldProvided } = require('../../utils');

const user = {
  type: UserType,
  description: 'Fetch single Zilker user',
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

const activeUser = {
  type: UserType,
  description: 'Fetch active Zilker user',
  resolve: (parent, args, context) => context.user,
};

const users = {
  type: new GraphQLList(UserType),
  description: 'Fetch list of Zilker users',
  resolve: (parent, args, { connector }) => connector.findAll('User'),
};

module.exports = {
  user,
  activeUser,
  users,
};
