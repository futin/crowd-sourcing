// core modules
const util = require('util');

// 3rd party modules

// internal alias modules
const {
  settings: {
    transactionConfig: {
      maxAttempts,
      timeout,
    },
  },
  constants: {
    errors,
  },
} = require('@config');
// internal modules

function timeoutFn(ms) {
  util.promisify(setTimeout);
  return new Promise(p => setTimeout(p, ms));
}

const transactionRetryWrapper = transactionToExecute =>
  (retryFunction, parent, args, context) =>
    transactionToExecute
      .then(data => data)
      .catch(async (error) => {
        let { extras: { attempts = 0 } = {} } = context;

        // custom retry logic. If attempts number surpasses the maxAttempts, simply return the error
        if (error.customErrorType === errors.RETRY_ERROR && attempts < maxAttempts) {
          // increase number of attempts, and restart the context.extras
          Object.assign(context, { extras: { attempts: attempts += 1 } });

          // wait until the method is called again
          await timeoutFn(timeout);

          return retryFunction(parent, args, context);
        }

        return error;
      });

module.exports = {
  transactionRetryWrapper,
};
