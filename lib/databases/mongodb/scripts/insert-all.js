// core modules

// 3rd party modules

// internal alias modules

// internal modules
const insertUsers = require('./insert-users');
const insertCategories = require('./insert-categories');
const insertNomination = require('./insert-nomination');

const { log } = console;

const runAllInserts = async () => {
  await insertNomination.then(insertCategories.then(insertUsers));

  log('All insertions done');
  process.exit();
};

runAllInserts();
