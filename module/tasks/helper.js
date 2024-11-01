/**
 * name : helper.js
 * author : prajwal
 * created-date : 09-May-2024
 * Description :  Forms Helper.
 */

const tasksQueries = require(DB_QUERY_BASE_PATH + '/tasks');
// const userService = require(SERVICES_BASE_PATH + '/users')
// const ObjectId = require('mongodb').ObjectID

module.exports = class TasksHelper {
  /**
   * Create Task.
   * @method
   * @name create
   * @param {Object} bodyData         - Task creation data
   * @param {String} userId           - User Id
   * @returns {JSON}                  - Task details.
   */
  static create(bodyData, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Construct insertion data
        bodyData['status'] = CONSTANTS.common.STATUS_ASSIGNED;
        bodyData['createdBy'] = userId;
        bodyData['updatedBy'] = userId;
        bodyData['updateHistory'] = [
          {
            time: new Date(),
            action: CONSTANTS.common.STATUS_ASSIGNED,
            user: userId,
          },
        ];
        bodyData['metaInformation'] = await UTILS.generateTaskMetaInformation(
          CONSTANTS.common.STATUS_ASSIGNED,
        );
        console.log('bodydata insert :', bodyData);

        const taskData = await tasksQueries.create(bodyData);
        if (!taskData || !taskData._id) {
          throw {
            status: HTTP_STATUS_CODE.bad_request.status,
            message: CONSTANTS.apiResponses.TASK_NOT_CREATED,
          };
        }

        return resolve({
          success: true,
          message: CONSTANTS.apiResponses.TASK_CREATED_SUCCESSFULLY,
          result: taskData,
        });
      } catch (error) {
        return resolve({
          message: error.message,
          success: false,
        });
      }
    });
  }

  /**
   * Update Task.
   * @method
   * @name update
   * @param {String} taskId					- Task id
   * @param {Object} bodyData					- Data to update
   * @param {Striing} userId					- User Id
   * @returns {JSON} 							- Update form data.
   */
  static update(taskId, bodyData, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('reached helper');
        const updateData = {};
        const dataForUpdation = {};

        if (bodyData.title) updateData.title = bodyData.title;
        if (bodyData.priority) updateData.priority = bodyData.priority;
        if (bodyData.description) updateData.description = bodyData.description;
        if (bodyData.isDeleted) updateData.isDeleted = bodyData.isDeleted;
        if (bodyData.assignedTo) updateData.assignedTo = bodyData.assignedTo;

        if (bodyData.status) {
          updateData.status = bodyData.status;
          updateData['metaInformation'] = await UTILS.generateTaskMetaInformation(bodyData.status);
          dataForUpdation['$push'] = {
            statusUpdateHistory: {
              value: bodyData.status,
              changedAt: new Date(),
              changedBy: userId,
            },
          };

          if (bodyData.status === CONSTANTS.common.STATUS_COMPLETED)
            updateData.completedAt = new Date();
          if (bodyData.status === CONSTANTS.common.STATUS_VERIFIED)
            updateData.verifiedAt = new Date();
        }
        dataForUpdation['$set'] = updateData;
        const filter = {
          _id: ObjectId(taskId),
          isDeleted: false,
          $or: [{ createdBy: userId }, { assignedTo: userId }],
        };

        const updatedTask = await tasksQueries.update(filter, dataForUpdation, { new: true });
        if (!updatedTask || !updatedTask._id) {
          return resolve({
            status: HTTP_STATUS_CODE.bad_request.status,
            message: CONSTANTS.apiResponses.TASK_NOT_UPDATED,
          });
        }
        return resolve({
          success: true,
          message: CONSTANTS.apiResponses.TASK_UPDATED_SUCCESSFULLY,
          result: updatedTask,
        });
      } catch (error) {
        return resolve({
          message: error.message,
          success: false,
        });
      }
    });
  }

  // /**
  //  * Read Form.
  //  * @method
  //  * @name read
  //  * @param {String} _id
  //  * @param {Object} bodyData
  //  * @param {Number} orgId
  //  * @param {String} userToken
  //  * @returns {JSON} - Read form data.
  //  */
  // static read(_id, bodyData, orgId, userToken) {
  // 	return new Promise(async (resolve, reject) => {
  // 		try {
  // 			// validate _id field
  // 			_id = _id === ':_id' ? null : _id
  // 			let filter = {}
  // 			if (_id) {
  // 				filter = { _id: ObjectId(_id), organizationId: orgId }
  // 			} else {
  // 				filter = { ...bodyData, organizationId: orgId }
  // 			}
  // 			const form = await formQueries.findOneForm(filter)
  // 			let defaultOrgForm
  // 			if (!form || !form._id) {
  // 				// call getDefaultOrgId() to get default organization details from user-service
  // 				const defaultOrgId = await this.getDefaultOrgId(userToken)
  // 				if (!defaultOrgId) {
  // 					return resolve({
  // 						success: false,
  // 						message: CONSTANTS.apiResponses.DEFAULT_ORG_ID_NOT_SET,
  // 					})
  // 				}
  // 				filter = _id
  // 					? { _id: ObjectId(_id), organizationId: defaultOrgId }
  // 					: { ...bodyData, organizationId: defaultOrgId }
  // 				defaultOrgForm = await formQueries.findOneForm(filter)
  // 			}
  // 			if (!form && !defaultOrgForm) {
  // 				throw {
  // 					status: HTTP_STATUS_CODE.bad_request.status,
  // 					message: CONSTANTS.apiResponses.FORM_NOT_FOUND,
  // 				}
  // 			}
  // 			return resolve({
  // 				success: true,
  // 				message: CONSTANTS.apiResponses.FORM_FETCHED_SUCCESSFULLY,
  // 				data: form ? form : defaultOrgForm,
  // 				result: form ? form : defaultOrgForm,
  // 			})
  // 		} catch (error) {
  // 			return resolve({
  // 				status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
  // 				message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
  // 			})
  // 		}
  // 	})
  // }

  // /**
  //  * Read Form Version.
  //  * @method
  //  * @name readAllFormsVersion
  //  * @returns {JSON} - Read form data.
  //  */
  // static readAllFormsVersion() {
  // 	return new Promise(async (resolve, reject) => {
  // 		try {
  // 			const filter = 'all'
  // 			const projectFields = ['_id', 'type', 'version']
  // 			// db query to get forms version of all documents
  // 			const getAllFormsVersion = await formQueries.formDocuments(filter, projectFields)
  // 			if (!getAllFormsVersion || !getAllFormsVersion.length > 0) {
  // 				throw {
  // 					status: HTTP_STATUS_CODE.bad_request.status,
  // 					message: CONSTANTS.apiResponses.FORM_VERSION_NOT_FETCHED,
  // 				}
  // 			}
  // 			return resolve({
  // 				success: true,
  // 				message: CONSTANTS.apiResponses.FORM_VERSION_FETCHED_SUCCESSFULLY,
  // 				data: getAllFormsVersion ? getAllFormsVersion : [],
  // 				result: getAllFormsVersion ? getAllFormsVersion : [],
  // 			})
  // 		} catch (error) {
  // 			return resolve({
  // 				status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
  // 				message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
  // 			})
  // 		}
  // 	})
  // }
};
