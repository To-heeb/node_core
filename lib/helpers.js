/**
 * Helpers for various tasks
 * 
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');

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

// Creat a string of random alphanumeric characters, of given length
helpers.createRandomString = function (strLength) {
    strLength = typeof strLength === 'number' && strLength > 0 ? strLength : false;

    if (strLength) {

        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        // Start the final string
        var str = '';
        for (i = 0; i < strLength; i++) {
            // Get the random characters
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append the characters to the end of the string
            str += randomCharacter;
        }
        return str;
    } else {
        return false;
    }
}

// Send SMS to twilio
helpers.sendTwilioSms = function (phone, msg, callback) {
    // Validate parameters
    phone = typeof (phone) == 'string' && phone.trim().length >= 10 ? phone.trim() : false;
    msg = typeof (msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    if (phone && msg) {

        // Configure the request payload
        var payload = {
            'From': config.twilio.fromPhone,
            'To': '+234' + phone,
            'Body': msg
        };
        var stringPayload = querystring.stringify(payload);


        // Configure the request details
        var requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
            'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
            }
        };

        // Instantiate the request object
        var req = https.request(requestDetails, function (res) {
            // Grab the status of the sent request
            var status = res.statusCode;
            // Callback successfully if the request went through
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was ' + status);
            }
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error', function (e) {
            callback(e);
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();

    } else {
        callback('Given parameters were missing or invalid');
    }
};



//  Export the modules
module.exports = helpers;