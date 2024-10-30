/**
 * name : admin.js
 * author : Prajwal
 * created-date : 04-Apr-2024
 * Description : Admin related information.
 */

// Dependencies
const adminHelper = require(MODULES_BASE_PATH + '/admin/helper')

module.exports = class Admin {
	static get name() {
		return 'admin'
	}

	/**
  * @api {post} /project/v1/admin/createIndex/:_collectionName 
  * @apiVersion 1.0.0
  * @apiName createIndex
  * @apiGroup Admin
  * @apiParamExample {json} Request-Body:
    {
        "keys": [
            "scope.entities"
        ]
    }
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /project/v1/admin/createIndex/solutions
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
    {
        "message": "Keys indexed successfully",
        "status": 200
    }
  */

	/**
	 * Indexing specified keys in a model
	 * @method
	 * @name createIndex
	 * @param {Object} req - requested data.
	 * @param {String} req.params._id - collection name.
	 * @param {Array} req.body.keys - keys to be indexed.
	 * @returns {Object} success/failure message.
	 */

	async createIndex(req) {
		return new Promise(async (resolve, reject) => {
			try {
				let collection = req.params._id
				let keys = req.body.keys

				const isIndexed = await adminHelper.createIndex(collection, keys)

				return resolve(isIndexed)
			} catch (error) {
				return reject({
					status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}

	/**
   * @api {post} /project/v1/admin/dbFind/:collectionName
   * List of data based on collection
   * @apiVersion 1.0.0
   * @apiGroup Admin
   * @apiSampleRequest /project/v1/admin/dbFind/projects
   * @param {json} Request-Body:
   * {
   * "query" : {
        "userId": "18155ae6-493d-4369-9668-165eb6dcaa2a",
        "_id": "601921116ffa9c5e9d0b53e5"
      },
      "projection" : ["title"],
      "limit": 100,
      "skip": 2
    }
    * @apiParamExample {json} Response:
    * {
        "message": "Data Fetched Or Updated Successfully",
        "status": 200,
        "result": [
            {
                "_id": "601921e86ffa9c5e9d0b53e7",
                "title": "Please edit this project for submitting your Prerak Head Teacher of the Block-19-20 project"
            },
            {
                "_id": "60193ce26ffa9c5e9d0b53fe",
                "title": "Please edit this project for submitting your Prerak Head Teacher of the Block-19-20 project"
            }
        ]
    * }   
    * @apiUse successBody
    * @apiUse errorBody
    */

	/**
	 * List of data based on collection
	 * @method
	 * @name dbFind
	 * @param {String} _id - MongoDB Collection Name
	 * @param {Object} req - Req Body
	 * @returns {JSON} list of data.
	 */

	async dbFind(req) {
		return new Promise(async (resolve, reject) => {
			try {
				let result = await adminHelper.dbFind(req.params._id, req.body)

				return resolve(result)
			} catch (error) {
				return reject({
					status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}
}
