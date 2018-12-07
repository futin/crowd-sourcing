// core modules

// 3rd party modules

// internal alias modules

// internal modules
const fullNominations = require('./full-nomination');
const normalizedNominations = require('./normalized-nominations');

module.exports = {
  ...fullNominations,
  ...normalizedNominations,
};
