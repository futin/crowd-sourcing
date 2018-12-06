// core node modules

// 3rd party modules
const { skip } = require('graphql-resolvers');

// internal modules

/**
 * It validates user's role against provided list of roles
 *
 * @param {Array} validRoles
 */
const roleValidator = validRoles =>
  (parent, args, { user }) =>
    (validRoles.includes(user.role) ? skip : new Error('Insufficient privileges'));

module.exports = {
  roleValidator,
};
