/**
 * name         : forms.js
 * author       : Vishnu
 * created-At   : 31-Oct-2024
 * Description  : Forms Controller.
 */

// dependencies
let tasksHelpers = require(MODULES_BASE_PATH + '/tasks/helper');

/**
 * tasks service.
 * @class
 */

module.exports = class Tasks extends Abstract {
  constructor() {
    super('tasks');
  }
  static get name() {
    return 'tasks';
  }
  /**
	 * @api {post} /doit/v1/tasks/create
	 * @apiVersion 1.0.0
	 * @apiName create
	 * @apiGroup tasks
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-auth-token Authenticity token
	 * @apiSampleRequest /doit/v1/tasks/create
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Request-Body:
		

    * @apiParamExample {json} Response:
		
	*/
  /**
   * create task
   * @method                                                          - POST
   * @name                                                            - create
   * @param {Object} req.body                                         - request data.
   * @param {Number} req.userDetails.userInformation.userId           - userId.
   * @returns {JSON}                                                  - task creation object.
   */

  async create(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let createdForm = await formsHelpers.create(
          req.body,
          req.userDetails.userInformation.userId,
        );

        return resolve(createdForm);
      } catch (error) {
        return resolve({
          status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
          message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
	 * @api {post} /project/v1/forms/update/:_id
	 * @apiVersion 1.0.0
	 * @apiName update
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-authenticated-user-token Authenticity token
	 * @apiSampleRequest /project/v1/forms/update/663cc73584f1a0eb4e97e3db
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Request-Body:
		{
			"type" : "cccc",
			"subType" : "ppp",
			"organizationId" : 1,
			"data" : {
				"name" : "xyz"
			}
		}

    * @apiParamExample {json} Response:
		{
			"message": "Form updated successfully",
			"status": 200,
			"result": {
				"_id": "663cc73584f1a0eb4e97e3db",
				"version": 0,
				"deleted": false,
				"type": "cccc",
				"subType": "ppp",
				"data": {
					"name": "xyz"
				},
				"organizationId": 1,
				"updatedAt": "2024-05-09T12:57:53.636Z",
				"createdAt": "2024-05-09T12:53:09.920Z",
				"__v": 0
			}
		}
	*/

  /**
   * updates form
   * @method
   * @name update
   * @param {String} req.params._id - form id.
   * @param {Object} req.body - request data.
   * @param {Number} req.userDetails.userInformation.organizationId -organization id.
   * @returns {JSON} - forms updation response.
   */

  async update(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedForm = await formsHelpers.update(
          req.params._id,
          req.body,
          req.userDetails.userInformation.organizationId,
        );
        return resolve(updatedForm);
      } catch (error) {
        return resolve({
          status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
          message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
	 * @api {get} /project/v1/forms/read/:_id
	 * @apiVersion 1.0.0
	 * @apiName read
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-authenticated-user-token Authenticity token
	 * @apiSampleRequest /project/v1/forms/read/663cc73584f1a0eb4e97e3db
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Request-Body:
		{
			"type" : "cccc",
			"subType" : "ppp"
		}

    * @apiParamExample {json} Response:
		{
			"message": "Form fetched successfully",
			"status": 200,
			"result": {
				"version": 0,
				"deleted": false,
				"_id": "663cc73584f1a0eb4e97e3db",
				"type": "cccc",
				"subType": "ppp",
				"data": {
					"name": "xyz"
				},
				"organizationId": 1,
				"updatedAt": "2024-05-09T12:57:53.636Z",
				"createdAt": "2024-05-09T12:53:09.920Z",
				"__v": 0
			}
		}
	*/

  /**
   * reads form
   * @method
   * @name read
   * @param {String} req.params._id - form id.
   * @param {Object} req.body - request data.
   * @param {Number} req.userDetails.userInformation.organizationId -organization id.
   * @param {String} req.userDetails.userToken -userToken.
   * @returns {JSON} - form object.
   */

  async read(req) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!req.params._id && Object.keys(req.body).length === 0) {
          const formData = await formsHelpers.readAllFormsVersion();
          return resolve(formData);
        } else {
          const formData = await formsHelpers.read(
            req.params._id,
            req.body,
            req.userDetails.userInformation.organizationId,
            req.userDetails.userToken,
          );
          return resolve(formData);
        }
      } catch (error) {
        return resolve({
          status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
          message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }
};
