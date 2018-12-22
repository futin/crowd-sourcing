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

/**
 * Factory function responsible for transaction-retry logic. It accepts a promise as an argument,
 * and returns new function
 *
 * @param {Promise} transactionToExecute  - promise that should be handled. ".then()" is only reflected back,
 *                                          we are only interested in error handling.
 */
const transactionRetryWrapper = transactionToExecute =>
  /**
   * A original function with all of its arguments, which should be re-called if:
   *  - error has a custom type "RETRY_ERROR" assigned to it
   *  - current number of attempts is less then the maximum number of attempts
   *
   * timoutFn is used as a throttle here, in order to save memory
   *
   * @param {Function} originalResolver      - Original function, which calls "transactionRetryWrapper" under the hood.
   * @param {Object | null} parent           - GraphQL parameter
   * @param {Object} args                    - GraphQL parameter
   * @param {Object} context                 - Context is being shared between recursive calls and it is used to "count"
   *                                           the number of attempts for each method invocation. Once the attempts
   *                                           has been iterated, the "extras" are reset and re-assigned to context.
   * @returns {Promise<T | never>}
   */
  (originalResolver, parent, args, context) =>
    transactionToExecute
      .then(data => data)
      .catch(async (error) => {
        let { extras: { attempts = 0 } = {} } = context;

        // custom retry logic. If attempts number surpasses the maxAttempts, simply return the error
        if (error.customErrorType === errors.RETRY_ERROR && attempts < maxAttempts) {
          // increase number of attempts, and reset the context.extras
          Object.assign(context, { extras: { attempts: attempts += 1 } });

          // wait until the method is called again
          await timeoutFn(timeout);

          return originalResolver(parent, args, context);
        }

        return error;
      });

module.exports = {
  transactionRetryWrapper,
};
