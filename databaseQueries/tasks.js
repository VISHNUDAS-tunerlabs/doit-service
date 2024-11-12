/**
 * name           : tasks.js.
 * author         : vishnu.
 * created-date   : 11-Nov-2024.
 * Description    : Database queries for Task.
 */

module.exports = class Forms {
  /**
   * create form.
   * @method
   * @name createForm
   * @param {Object} [bodyData] - form data.
   * @returns {Object} newly created form details.
   */
  static create(bodyData) {
    return new Promise(async (resolve, reject) => {
      try {
        let taskDetails = await database.models.tasks.create(bodyData);
        return resolve(taskDetails);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * update a form.
   * @method
   * @name updateOneForm
   * @param {Object} [filterData = "all"] - forms filter query.
   * @param {Object} setData- fields to be updated.
   * @param {Object} [returnData = {new : true}] - boolean value true/false to return the updated document or not
   * @returns {Object} newly created form details.
   */
  static update(filterData, updateData, returnData = { new: false }) {
    return new Promise(async (resolve, reject) => {
      try {
        let updatedData = await database.models.tasks
          .findOneAndUpdate(filterData, updateData, returnData)
          .lean();
        return resolve(updatedData);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }

  /**
   * find a task document.
   * @method
   * @name findOneForm
   * @param {Object} [filterData = "all"]   - task filter query.
   * @param {Array} [fieldsArray = "all"]   - projected fields.
   * @param {Array} [skipFields = "none"]   - field not to include.
   * @returns {Object}                      - task details.
   */
  static findOneTask(filterData = 'all', fieldsArray = 'all', skipFields = 'none') {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = filterData != 'all' ? filterData : {};

        let projection = {};
        if (fieldsArray != 'all') {
          fieldsArray.map((key) => {
            projection[key] = 1;
          });
        }
        if (skipFields != 'none') {
          skipFields.map((key) => {
            projection[key] = 0;
          });
        }

        const taskData = await database.models.tasks.findOne(queryObject, projection);
        return resolve(taskData);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * find tasks
   * @method
   * @name getAggregate
   * @param {Array} query   - Aggregation query.
   * @returns {Array}       - List of tasks.
   */

  static getAggregate(query = []) {
    return new Promise(async (resolve, reject) => {
      try {
        let taskDocuments = await database.models.tasks.aggregate(query);

        return resolve(taskDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }
};
