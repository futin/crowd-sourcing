// core modules

// 3rd party modules

// internal alias modules

// internal modules
const { settings } = require('../../../config');
const scriptRunner = require('./script-runner');

const { environment, databases: { mongodb: { url } } } = settings;
const { log } = console;
const { USERNAME_INSERT: username = 'ajevtic' } = process.env;

const insertScripts = [
  {
    dbName: `crowd-source-${environment}`,
    collectionName: 'authusers',
    action: collection => collection.insertOne({ username }),
  },
  {
    dbName: `crowd-source-${environment}`,
    collectionName: 'users',
    // create admin user
    action: collection => collection.insertOne({
      username,
      email: `${username}@ztech.io`,
      fullName: 'admin',
      role: 'admin',
      pointsToAssign: 10,
      active: true,
    }),
  },
];

module.exports = scriptRunner(insertScripts, 'mongodb://mongo-rs0-1:27017')
  .then(() => (log('Users inserted!'), process.exit())) // eslint-disable-line no-sequences
  .catch(err => log(err));
