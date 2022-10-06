/**
 * Create and export configuration variables
 * 
 */

// Container for al environment variables
var environments = {};

// Staging {default} environment
environments.staging = {
    'httpPort': 3100,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'anopensecret'

};

// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'anopensecret'
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
