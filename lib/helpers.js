/**
 * Helpers for various tasks
 * 
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');

// Container for all helpers
var helpers = {};


// Create a SHA256 hash
helpers.hashPassword = function (password) {
    if (typeof (password) === 'string' && password.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(password).digest('hex');
        return hash;
    } else {
        return false;
    }
}

// Parse a JSON to object
helpers.parseJSONToObject = function (json) {
    try {
        return obj = JSON.parse(json);
    } catch (error) {
        return {};
    }
}






//  Export the modules
module.exports = helpers;