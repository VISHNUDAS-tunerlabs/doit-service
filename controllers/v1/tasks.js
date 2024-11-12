/**
 * name         : tasks.js
 * author       : Vishnu
 * created-At   : 31-Oct-2024
 * Description  : Tasks Controller.
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
		{
        "title": "Test task creation API",
        "description": "This task is to test innovation project apis",
        "priority": "high"
    }

   * @apiParamExample {json} Response:

    {
        "message": "Task Created Successfully",
        "status": 200,
        "result": {
            "status": "assigned",
            "isDeleted": false,
            "updatedBy": "162",
            "createdBy": "162",
            "tasks": [],
            "statusUpdateHistory": [],
            "_id": "67248ee87571e033208b8da7",
            "deleted": false,
            "title": "Test task creation API",
            "description": "This task is to test innovation project apis",
            "priority": "high",
            "metaInformation": {
                "creatorStatus": "assigned",
                "assigneeStatus": "start"
            },
            "updatedAt": "2024-11-01T08:18:48.339Z",
            "createdAt": "2024-11-01T08:18:48.339Z",
            "__v": 0
        }
    }
        
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
        let taskDetails = await tasksHelpers.create(
          req.body,
          req.userDetails.userInformation.userId,
        );
        return resolve(taskDetails);
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
	 * @api {post} /doit/v1/tasks/update/:_id
	 * @apiVersion 1.0.0
	 * @apiName update
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-auth-token Authenticity token
	 * @apiSampleRequest /doit/v1/tasks/update/663cc73584f1a0eb4e97e3db
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Request-Body:
		
    * @apiParamExample {json} Response:
		
	*/

  /**
   * updates task
   * @method
   * @name update
   * @param {String} req.params._id                           - task id.
   * @param {Object} req.body                                 - request data.
   * @param {Number} req.userDetails.userInformation.userId   - organization id.
   * @returns {JSON}                                          - forms updation response.
   */

  async update(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const taskDetails = await tasksHelpers.update(
          req.params._id,
          req.body,
          req.userDetails.userInformation.userId,
        );
        return resolve(taskDetails);
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
	 * @api {get} /doit/v1/tasks/read/:_id
	 * @apiVersion 1.0.0
	 * @apiName update
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-auth-token Authenticity token
	 * @apiSampleRequest /doit/v1/tasks/read/663cc73584f1a0eb4e97e3db
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Request-Body:
	 * @apiParamExample {json} Response:
   * {
        "message": "Fetched Task Details",
        "status": 200,
        "result": {
            "status": "verified",
            "isDeleted": false,
            "updatedBy": "162",
            "createdBy": "162",
            "statusUpdateHistory": [
                {
                    "value": "started",
                    "changedAt": "2024-11-01T09:18:59.010Z",
                    "changedBy": "162"
                },
                {
                    "value": "completed",
                    "changedAt": "2024-11-01T09:23:17.935Z",
                    "changedBy": "162"
                },
                {
                    "value": "verified",
                    "changedAt": "2024-11-01T09:23:59.527Z",
                    "changedBy": "162"
                }
            ],
            "deleted": false,
            "_id": "67248ee87571e033208b8da7",
            "title": "Test task creation API update",
            "description": "This task is to test innovation project apis",
            "priority": "low",
            "metaInformation": {
                "creatorStatus": "verified",
                "assigneeStatus": "verified",
                "isTheOwner": true
            },
            "updatedAt": "2024-11-01T09:23:59.528Z",
            "createdAt": "2024-11-01T08:18:48.339Z",
            "__v": 0,
            "completedAt": "2024-11-01T09:23:17.935Z",
            "verifiedAt": "2024-11-01T09:23:59.527Z"
        }
    }
		
	*/

  /**
   * read task details
   * @method
   * @name read
   * @param {String} req.params._id                           - task id.
   * @returns {JSON}                                          - task details.
   */

  async read(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const taskDetails = await tasksHelpers.read(
          req.params._id,
          req.userDetails.userInformation.userId,
        );
        return resolve(taskDetails);
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
	 * @api {get} /doit/v1/tasks/list
	 * @apiVersion 1.0.0
	 * @apiName update
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-auth-token Authenticity token
	 * @apiSampleRequest /doit/v1/tasks/list?page=1&limit=50&search=&filter=all&priority=
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Request-Body:
	 * @apiParamExample {json} Response:
   * 
   * {
        "status": 200,
        "result": {
            "data": [
                {
                    "_id": "67323779334bca5bc44e4c5e",
                    "status": "assigned",
                    "title": "Test task creation API update api 2",
                    "description": "This task is to test innovation project apis",
                    "priority": "medium",
                    "metaInformation": {
                        "creatorStatus": "assigned",
                        "assigneeStatus": "start",
                        "assigneeName": "Priyanka"
                    }
                },
                {
                    "_id": "67323770334bca5bc44e4c5c",
                    "status": "assigned",
                    "title": "Test task creation API update api",
                    "description": "This task is to test innovation project apis",
                    "priority": "medium",
                    "metaInformation": {
                        "creatorStatus": "assigned",
                        "assigneeStatus": "start",
                        "assigneeName": "Priyanka"
                    }
                }
            ],
            "count": 6
        }
    }
   * 
		
	*/

  /**
   * view the list of tasks
   * @method
   * @name read
   * @returns {JSON}                                          - task list.
   */

  async list(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const taskList = await tasksHelpers.list(
          req.userDetails.userInformation.userId,
          req.pageNo,
          req.pageSize,
          req.searchText,
          req.query.filter,
          req.query.status,
          req.query.priority,
        );
        return resolve(taskList);
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
