// core modules

// 3rd party modules

// internal alias modules
const { ing } = require('@utils');

// internal modules
const CategoryModel = require('../category-model');
const UserModel = require('../user-model');
const { isRelationValid } = require('../utils');

// we don't need to validate against nominationId,
// since it can't be added by an API
const validateNominee = ({ categoryId, userId }) =>
  Promise.all([
    isRelationValid(CategoryModel, categoryId),
    isRelationValid(UserModel, userId)]);

// simple array-to-promise transformer
const transformToPromiseList = (items, fn) => items.map(item => fn(item));

/**
 * Pre hooks definition for Nominee. Double Promise.all has been used to speed up the validation process.
 * If any validation along the way fails, error has been returned immediately and passed via next middleware.
 *
 * @type {{insertMany: preHooks.insertMany}}
 */
const preHooks = {
  insertMany: async (next, nominees) => {
    const [err] = await ing(Promise.all(transformToPromiseList(nominees, validateNominee)));
    next(err);
  },
};

module.exports = {
  preHooks,
};
