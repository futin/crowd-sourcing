// core modules

// 3rd party modules
const { argv } = require('yargs');

// internal alias modules

// internal modules
const scriptRunner = require('./script-runner');

const {
  NODE_ENV: environment = 'dev',
  MONGO_SERVERS_PATH: serversPath,
  USERNAME_INSERT: username = 'ajevtic',
} = argv;
const { log } = console;
const url = `mongodb://${serversPath}`;

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
      isActive: true,
    }),
  },
];

module.exports = scriptRunner(insertScripts, url)
  .then(() => (log('Users inserted!'), process.exit())) // eslint-disable-line no-sequences
  .catch(err => log(err));
