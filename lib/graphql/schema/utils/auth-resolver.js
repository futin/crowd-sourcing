// core node modules

// 3rd party modules
const { skip } = require('graphql-resolvers');

// internal alias modules

// internal modules

/**
 * It validates user's role against provided list of roles
 *
 * @param {Array} validRoles
 */
const userRoleValidator = validRoles =>
  (parent, args, { user }) =>
    (validRoles.includes(user.role) ? skip : new Error('Insufficient privileges'));

module.exports = {
  userRoleValidator,
};
