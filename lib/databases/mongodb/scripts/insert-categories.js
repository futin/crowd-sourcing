// core modules

// 3rd party modules

// internal alias modules

// internal modules
const { settings } = require('../../../config');
const scriptRunner = require('./script-runner');

const { environment, databases: { mongodb: { url } } } = settings;
const { log } = console;

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
