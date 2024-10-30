/**
 * name 		: globals.js
 * author 		: vishnu
 * created-date : 30-Oct-2024
 * Description 	: Globals data.
 */

/**
 * Globals configuration file.
 *
 * @file globals.js
 * @author Vishnu
 * @since 2024-10-30
 * @description Global data and configurations.
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const requireAll = require('require-all');

module.exports = function () {
    global.async = require('async');
    global.PROJECT_ROOT_DIRECTORY = path.join(__dirname, '..');
    global.MODULES_BASE_PATH = path.join(global.PROJECT_ROOT_DIRECTORY, 'module');
    global.DB_QUERY_BASE_PATH = path.join(global.PROJECT_ROOT_DIRECTORY, 'databaseQueries');
    global.GENERICS_FILES_PATH = path.join(global.PROJECT_ROOT_DIRECTORY, 'generics');
    global.SERVICES_BASE_PATH = path.join(global.GENERICS_FILES_PATH, 'services');
    global.GENERIC_HELPERS_PATH = path.join(global.GENERICS_FILES_PATH, 'helpers');
    global._ = require('lodash');
    global.UTILS = require(path.join(global.GENERIC_HELPERS_PATH, 'utils'));

    global.CSV_FILE_STREAM = require(path.join(global.PROJECT_ROOT_DIRECTORY, 'generics', 'file-stream'));
    require('./connections');

    global.HTTP_STATUS_CODE = require(path.join(global.GENERICS_FILES_PATH, 'http-status-codes'));

    // Load database models.
    global.models = requireAll({
        dirname: path.join(global.PROJECT_ROOT_DIRECTORY, 'models'),
        filter: /(.+)\.js$/,
        resolve: function (Model) {
            return Model;
        },
    });

    // Load base v1 controllers
    const pathToController = path.join(global.PROJECT_ROOT_DIRECTORY, 'controllers', 'v1');

    fs.readdirSync(pathToController).forEach(function (file) {
        checkWhetherFolderExistsOrNot(pathToController, file);
    });

    /**
     * Check whether folder exists or not.
     * @method
     * @name checkWhetherFolderExistsOrNot
     * @param {String} pathToFolder - Path to folder.
     * @param {String} file - File name.
     */
    function checkWhetherFolderExistsOrNot(pathToFolder, file) {
        const fullPath = path.join(pathToFolder, file);
        const folderExists = fs.lstatSync(fullPath).isDirectory();

        if (folderExists) {
            fs.readdirSync(fullPath).forEach(function (folderOrFile) {
                checkWhetherFolderExistsOrNot(path.join(pathToFolder, file), folderOrFile);
            });
        } else {
            if (file.match(/\.js$/) !== null) {
                require(fullPath);
            }
        }
    }

    // Schema for DB.
    global.schemas = {};
    fs.readdirSync(path.join(global.PROJECT_ROOT_DIRECTORY, 'models')).forEach(function (file) {
        if (file.match(/\.js$/) !== null) {
            const name = file.replace('.js', '');
            global.schemas[name] = require(path.join(global.PROJECT_ROOT_DIRECTORY, 'models', file));
        }
    });

    // All controllers
    global.controllers = requireAll({
        dirname: path.join(global.PROJECT_ROOT_DIRECTORY, 'controllers'),
        resolve: function (Controller) {
            return new Controller();
        },
    });

    // Message constants
    global.CONSTANTS = {};
    fs.readdirSync(path.join(global.GENERICS_FILES_PATH, 'constants')).forEach(function (file) {
        if (file.match(/\.js$/) !== null) {
            let name = file.replace('.js', '');
            name = global.UTILS.hyphenCaseToCamelCase(name);
            global.CONSTANTS[name] = require(path.join(global.GENERICS_FILES_PATH, 'constants', file));
        }
    });

    // Kafka Consumers
    fs.readdirSync(path.join(global.PROJECT_ROOT_DIRECTORY, 'generics', 'kafka', 'consumers')).forEach(function (file) {
        if (file.match(/\.js$/) !== null) {
            const name = file.replace('.js', '');
            global[name + 'Consumer'] = require(path.join(global.PROJECT_ROOT_DIRECTORY, 'generics', 'kafka', 'consumers', file));
        }
    })
};