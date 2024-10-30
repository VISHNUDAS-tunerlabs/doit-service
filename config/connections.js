/**
 * name 		: connectio.js
 * author 		: Vishnu
 * created-date : 30-Oct-2024
 * Description 	: onnections related information.
 */

/**
 * Mongodb Database configuration.
 * @function
 * @name mongodb_connect
 * @param {Object} configuration - mongodb database configuration.
 */

const mongodb_connect = function () {
	global.database = require('./db/mongodb')()
	global.ObjectId = database.ObjectId
	global.Abstract = require('../generics/abstract')
}

// Configuration data.

const configuration = {
	name: 'doit-api',
}

mongodb_connect()
module.exports = configuration