/**
 * Library for storing and editing data
 */


var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// Container for module to be exported
var lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/')

// Write to data  file
lib.create = function (dir, file, data, callback) {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {

        if (!err && fileDescriptor) {
            //Convert data to string
            var stringData = JSON.stringify(data);

            //Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function (err) {

                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file because: ', err);
                        }
                    });
                } else {
                    callback('Error writing to new file because: ', err);
                }
            });

        } else {
            callback('Could not create new file it already exist because: ', err);
        }
    })
}

// Read data from a file
lib.read = function (dir, file, callback) {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function (err, data) {
        if (!err && data) {
            var parseData = helpers.parseJSONToObject(data);
            callback(err, parseData);
        } else {
            callback(err, data);
        }

    })
}


// Update data inside a file
lib.update = function (dir, file, data, callback) {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {

            var stringData = JSON.stringify(data);

            // Truncate the file
            fs.ftruncate(fileDescriptor, function (err) {
                if (!err) {

                    // Write the file and close
                    fs.writeFile(fileDescriptor, stringData, function (err) {

                        if (!err) {
                            fs.close(fileDescriptor, function (err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing existing file because: ', err);
                                }
                            });
                        } else {
                            callback('Error writing to existing file because: ', err);
                        }
                    });
                } else {
                    callback("Error truncating file")
                }
            })


        } else {
            callback('Could not open file for updating, it may not exist yet');
        }
    })
}

// Delete a file
lib.delete = function (dir, file, callback) {
    // Unlink the file
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', function (err, file) {
        if (!err) {
            callback(err);
        } else {
            callback("Error deleting file")
        }
    });
}

// Export the module
module.exports = lib; 