// core node modules

// 3rd party modules
const { skip } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');

// internal modules

/**
 * It validates user's role against provided list of roles
 *
 * @param {Array} validRoles
 */
const roleValidatorResolver = validRoles =>
  (parent, args, { user }) =>
    (validRoles.includes(user.role) ? skip : new Error('Insufficient privileges'));

/**
 * Verify the ownership. If the user is admin, omit the ownership.
 *
 * @param parent
 * @param username
 * @param email
 * @param user
 */
const isOwnerResolver = (parent, { username, email }, { user }) =>
  ((
    username === user.username
    || email === user.email
    || roles.admin === user.role
  )
    ? skip
    : new Error('Insufficient privileges'));

module.exports = {
  roleValidatorResolver,
  isOwnerResolver,
};
