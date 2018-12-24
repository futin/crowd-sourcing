// core node modules
const fs = require('fs');

// 3rd party modules
const _ = require('lodash');
const tryRequire = require('try-require');
const debug = require('debug');
const { argv } = require('yargs');

// internal alias modules

// internal modules
const {
  loggerNamespaces: { settingsNamespace },
} = require('../constants');

const logger = debug(settingsNamespace);

const buildDefaultSettings = () => {
  const { NODE_ENV: argvEnv, HOST: argvHost, PORT: argvPort } = argv;
  const {
    NODE_ENV: env, HOST: host, PORT: port,
  } = process.env;

  const defaultConf = {
    environment: env || argvEnv || 'dev',
    host: host || argvHost,
    port: port || argvPort,
  };

  logger('Default configuration: %o', defaultConf);
  return defaultConf;
};

const buildSslSettings = () => {
  // try to get ssl-certs
  const sslConfig = tryRequire.resolve('./ssl-certs');
  if (!sslConfig) {
    logger('No ssl certificates found. Aborting building of ssl configuration');
    return {};
  }

  return {
    sslOptions: {
      key: fs.readFileSync(`${process.pwd()}/lib/config/ssl-certs/privkey.pem`),
      cert: fs.readFileSync(`${process.pwd()}/lib/config/ssl-certs/cert.pem`),
    },
  };
};

const buildSettingsByEnvironment = (defaultEnv) => {
  const envFileRegex = new RegExp(`^settings.config.${defaultEnv}.js$`);
  const envFileName = fs.readdirSync(__dirname).find(fileName => envFileRegex.test(fileName));
  const configuration = require(`./${envFileName}`); // eslint-disable-line global-require,import/no-dynamic-require

  if (!configuration) {
    throw new Error(`Unable to require filename [${envFileName}]`);
  }

  const config = _.reduce(
    configuration.settings,
    (settingsByEnv, settingsValue) => {
      const { name: configName, value: configValue } = settingsValue;

      Object.assign(settingsByEnv, {
        [configName]: configValue,
      });

      return settingsByEnv;
    }, {},
  );

  logger('Configuration by environment: %o', config);
  return config;
};

// build dynamically database url by environment
const transformDatabaseByEnv = (settings) => {
  const { databases, environment } = settings;
  const transformedDatabases = _.reduce(databases, (finalDb, database, key) => {
    const {
      mongoServers, username, password, replicaSet,
    } = database;

    // only mongodb is currently supported. ignore other dbs
    if (!key.startsWith('mongodb')) {
      Object.assign(finalDb, { [key]: database });
      return finalDb;
    }

    const dbUrl = [`${key}://`];

    // do we have multiple ports provided?
    dbUrl.push(mongoServers);

    if (username && password) {
      dbUrl.push(`${username}:${password}@`);
    }

    let dbName = `/crowd-source-${environment}`;
    if (replicaSet) {
      // add replica set name
      dbName = dbName.concat(`?replicaSet=${replicaSet}`);
    }

    dbUrl.push(dbName);

    Object.assign(database, { url: dbUrl.join('') });
    Object.assign(finalDb, { [key]: database });

    return finalDb;
  }, {});

  logger('Database transformed: %o', transformedDatabases);
  Object.assign(settings, { databases: transformedDatabases });

  return settings;
};

const appendRedirectUrl = config =>
  _.merge(config, {
    googleStrategy: {
      redirectUrl: `http://${config.host}:${config.port}/${config.authConfig.callbackUrl}`,
    },
  });

const settingsConfiguration = () => {
  const defaultSettings = buildDefaultSettings();
  const secureHttpOptions = buildSslSettings();
  const settingsByEnv = buildSettingsByEnvironment(defaultSettings.environment);
  const settingsWithRedirectUrl = appendRedirectUrl(settingsByEnv);

  const mergedSettings = _.defaultsDeep({}, defaultSettings, secureHttpOptions, settingsWithRedirectUrl);

  const appSettings = transformDatabaseByEnv(mergedSettings);
  logger('App settings: %o', appSettings);

  return appSettings;
};

module.exports = settingsConfiguration();
