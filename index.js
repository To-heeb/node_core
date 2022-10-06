/**
 * 
 * @description Primary implementation for API
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var fs = require('fs');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');


//Instaiate the HTTP server
var httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function () {
    console.log('Starting server on port ' + config.httpPort + ' in ' + config.envName + ' mode.');
}).on('error', function (err) { });


//Instaiate the HTTPS server
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem'),
};
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
    console.log('Starting server on port ' + config.httpsPort + ' in ' + config.envName + ' mode.');
}).on('error', function (err) { });

// All server logic for both the http and https servers
var unifiedServer = function (req, res) {

    //Get the url and parse it 
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an Object
    var queryStringObject = parsedUrl.query;

    //Get the HTTP Method
    var method = req.method;

    //Get the headers as an object
    var headers = req.headers;

    //Get the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (chunk) {
        buffer += decoder.write(chunk);
    })
    req.on('end', function () {
        buffer += decoder.end();

        // Choose the handler to handle the request, if not found route to not found
        var choosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the dta object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method.toLowerCase(),
            'headers': headers,
            'payload': helpers.parseJSONToObject(buffer),

        };

        // Route the request to the handler specified in the router
        choosenHandler(data, function (statusCode, payload) {
            // Use the status code called back  by the handler or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler or default to an empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            // Send the response
            res.end(payloadString);


            // Log the request path
            console.log('Request recieved on with these payload: ', statusCode, payloadString);
        });

    });

};


// Define a request router
var router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens
}
