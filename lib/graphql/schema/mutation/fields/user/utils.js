// core node modules

// 3rd party modules

// internal alias modules
const { constants: { roles } } = require('@config');

// internal modules

/**
 * Validate config roles with the current user role. Is it valid?
 *
 * @param {Object} role
 */
const isProvidedRoleValid = role => role && Object.values(roles).includes(role);

module.exports = {
  isProvidedRoleValid,
};
