// core node modules

// 3rd party modules

// internal alias modules
const { constants: { roles } } = require('@config');

// internal modules

const isProvidedRoleValid = role => role && Object.keys(roles).includes(role);

module.exports = {
  isProvidedRoleValid,
};
