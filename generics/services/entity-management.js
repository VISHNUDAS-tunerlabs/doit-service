/**
 * name : entity-management.js
 * author : prajwal
 * Date : 18-Apr-2024
 * Description : Entity service related information.
 */

//dependencies
const request = require('request')
const fs = require('fs')

const interfaceServiceUrl = process.env.INTERFACE_SERVICE_URL

/**
 * List of entity data.
 * @function
 * @name entityDocuments
 * @param {Object} filterData - Filter data.
 * @param {Array} projection - Projected data.
 * @returns {JSON} - List of entity data.
 */

// Function to find entity documents based on the given filter and projection
const entityDocuments = function (filterData = 'all', projection = 'all') {
	return new Promise(async (resolve, reject) => {
		try {
			// Function to find entity documents based on the given filter and projection
			const url =
				interfaceServiceUrl +
				process.env.ENTITY_MANAGEMENT_SERVICE_BASE_URL +
				CONSTANTS.endpoints.FIND_ENTITY_DOCUMENTS
			// Set the options for the HTTP POST request
			const options = {
				headers: {
					'content-type': 'application/json',
					'internal-access-token': process.env.INTERNAL_ACCESS_TOKEN,
				},
				json: {
					query: filterData,
					projection: projection,
				},
			}
			// Make the HTTP POST request to the entity management service
			request.post(url, options, requestCallBack)

			// Callback function to handle the response from the HTTP POST request
			function requestCallBack(err, data) {
				let result = {
					success: true,
				}

				if (err) {
					result.success = false
				} else {
					let response = data.body
					// Check if the response status is OK (HTTP 200)
					if (response.status === HTTP_STATUS_CODE.ok.status) {
						result['data'] = response.result
					} else {
						result.success = false
					}
				}

				return resolve(result)
			}
		} catch (error) {
			return reject(error)
		}
	})
}

/**
 * List of entity data.
 * @function
 * @name entityDocuments
 * @param {Object} filterData - Filter data.
 * @param {Array} projection - Projected data.
 * @returns {JSON} - List of entity data.
 */

// Function to find entity type documents based on the given filter, projection, and user token
const entityTypeDocuments = function (filterData = 'all', projection = 'all', userToken) {
	return new Promise(async (resolve, reject) => {
		try {
			// Construct the URL for the entity management service
			const url =
				interfaceServiceUrl +
				process.env.ENTITY_MANAGEMENT_SERVICE_BASE_URL +
				CONSTANTS.endpoints.FIND_ENTITY_TYPE_DOCUMENTS
			// Set the options for the HTTP POST request
			const options = {
				headers: {
					'content-type': 'application/json',
					'internal-access-token': process.env.INTERNAL_ACCESS_TOKEN,
					'x-authenticated-token': userToken,
				},
				json: {
					query: filterData,
					projection: projection,
				},
			}

			// Make the HTTP POST request to the entity management service
			request.post(url, options, requestCallBack)

			// Callback function to handle the response from the HTTP POST request
			function requestCallBack(err, data) {
				let result = {
					success: true,
				}

				if (err) {
					result.success = false
				} else {
					let response = data.body
					// Check if the response status is OK (HTTP 200)
					if (response.status === HTTP_STATUS_CODE.ok.status) {
						result['data'] = response.result
					} else {
						result.success = false
					}
				}

				return resolve(result)
			}
		} catch (error) {
			return reject(error)
		}
	})
}

module.exports = {
	entityDocuments: entityDocuments,
	entityTypeDocuments: entityTypeDocuments,
}
