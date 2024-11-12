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
   * @param {String} taskId					  - Task id
   * @param {Object} bodyData					- Data to update
   * @param {Striing} userId					- User Id
   * @returns {JSON} 							    - Update form data.
   */
  static update(taskId, bodyData, userId) {
    return new Promise(async (resolve, reject) => {
      try {
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

  /**
   * Read Form.
   * @method
   * @name read
   * @param {String} taskId             - Task Id.
   * @param {String} userId             - User Id.
   * @returns {JSON}                    - Read task data.
   */
  static read(taskId, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const filter = { _id: taskId };
        const task = await tasksQueries.findOneTask(filter);
        if (!task || !task._id) {
          return resolve({
            success: false,
            message: CONSTANTS.apiResponses.FAILED_TO_FETCH_TASK_DATA,
          });
        }
        // determine if task detail is requested by the owner or not
        task.metaInformation.isTheOwner = task.createdBy === userId;

        return resolve({
          success: true,
          message: CONSTANTS.apiResponses.TASK_DETAILS_FETCHED_SUCCESSFULLY,
          result: task,
        });
      } catch (error) {
        return resolve({
          status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
          message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
        });
      }
    });
  }

  static list(
    userId,
    pageNo = '',
    pageSize = '',
    searchText,
    filter = 'all',
    status = 'active',
    priority = '',
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let matchQuery = {
          isDeleted: false,
        };
        if (status == 'active') {
          matchQuery['status'] = {
            $in: [CONSTANTS.common.STATUS_STARTED, CONSTANTS.common.STATUS_ASSIGNED],
          };
        } else {
          matchQuery.status = status;
        }

        if (filter == CONSTANTS.common.ASSIGNED_TO_ME) {
          matchQuery['assignedTo'] = userId;
        } else if (filter == CONSTANTS.common.CREATED_BY_ME) {
          matchQuery['createdBy'] = userId;
        }

        //Set priority of task to fetch
        if (priority !== '') {
          matchQuery['priority'] = priority;
        }

        let searchData = [
          {
            title: new RegExp(searchText, 'i'),
          },
          {
            description: new RegExp(searchText, 'i'),
          },
        ];

        if (searchText !== '') {
          if (matchQuery['$or']) {
            matchQuery['$and'] = [{ $or: matchQuery.$or }, { $or: searchData }];
            delete matchQuery.$or;
          } else {
            matchQuery['$or'] = searchData;
          }
        }

        let projection1 = {
          description: 1,
          priority: 1,
          title: 1,
          metaInformation: 1,
          status: 1,
          assigneeName: 1,
          updateHistory: 1,
        };

        let facetQuery = {};
        facetQuery['$facet'] = {};

        facetQuery['$facet']['totalCount'] = [{ $count: 'count' }];

        facetQuery['$facet']['data'] = [{ $skip: pageSize * (pageNo - 1) }, { $limit: pageSize }];

        let projection2 = {};

        projection2['$project'] = {
          data: 1,
          count: {
            $arrayElemAt: ['$totalCount.count', 0],
          },
        };
        let taskDocuments = await tasksQueries.getAggregate([
          { $match: matchQuery },
          {
            $sort: { updatedAt: -1 },
          },
          { $project: projection1 },
          facetQuery,
          projection2,
        ]);

        return resolve({
          success: true,
          message: CONSTANTS.apiResponses.TASK_LIST,
          result: taskDocuments[0],
        });
      } catch (error) {
        return resolve({
          success: false,
          message: error.message,
          data: [],
        });
      }
    });
  }
};
