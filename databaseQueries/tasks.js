/**
 * name : forms.js.
 * author : Prajwal.
 * created-date : 08-May-2024.
 * Description : Database queries for Forms.
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
};
