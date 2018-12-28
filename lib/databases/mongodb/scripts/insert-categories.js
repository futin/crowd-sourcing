// core modules

// 3rd party modules
const { argv } = require('yargs');

// internal alias modules

// internal modules
const scriptRunner = require('./script-runner');

const {
  NODE_ENV: environment = 'dev',
  MONGO_SERVERS_PATH: serversPath,
} = argv;
const { log } = console;
const url = `mongodb://${serversPath}`;

const insertScripts = [
  {
    dbName: `crowd-source-${environment}`,
    collectionName: 'categories',
    action: (collection) => {
      const categories = [
        { name: 'Machine', description: 'This is a machine category' },
        { name: 'Mom', description: 'This is a mom category' },
        { name: 'Scribe', description: 'This is a scribe category' },
        { name: 'Ninja', description: 'This is a ninja category' },
      ];

      return collection.insertMany(categories);
    },
  },
];

module.exports = scriptRunner(insertScripts, url)
  .then(() => (log('Categories inserted!'), process.exit()))
  .catch(err => log(err));
