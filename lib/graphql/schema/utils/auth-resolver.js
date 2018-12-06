// core node modules

// 3rd party modules

// internal modules

const roleValidator = validRoles =>
  (parent, args, { user }) => validRoles.includes(user.role) || new Error('Insufficient privileges');

module.exports = {
  roleValidator,
};
