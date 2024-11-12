/**
 * name 		: api-responses.js
 * author 		: vishnu
 * Date 		: 30-Oct-2024
 * Description 	: All api response messages.
 */

module.exports = {
  SUCCESS: 'Success',
  TOKEN_MISSING_CODE: 'ERR_TOKEN_FIELD_MISSING',
  TOKEN_MISSING_MESSAGE: 'Required field token is missing',
  TOKEN_INVALID_CODE: 'ERR_TOKEN_INVALID',
  TOKEN_INVALID_MESSAGE: 'Access denied',
  MISSING_TOKEN_AND_INTERNAL_ACCESS_TOKEN_CODE: 'ERR_REQUEST_FIELDS_MISSING',
  MISSING_TOKEN_AND_INTERNAL_ACCESS_TOKEN_MESSAGE:
    'Token and Internal access token both are required field',
  MISSING_TOKEN_OR_INTERNAL_ACCESS_TOKEN_CODE: 'ERR_REQUEST_ANY_ONE_FIELD_MISSING',
  MISSING_TOKEN_OR_INTERNAL_ACCESS_TOKEN_MESSAGE:
    'Token or Internal access token either one is required',
  TASK_NOT_CREATED: 'Task Creation Failed',
  TASK_CREATED_SUCCESSFULLY: 'Task Created Successfully',
  TASK_NOT_UPDATED: 'Task Updation Failed',
  TASK_UPDATED_SUCCESSFULLY: 'Task Updated Successfully',
  FAILED_TO_FETCH_TASK_DATA: 'Failed To Fetch Task Data',
  TASK_DETAILS_FETCHED_SUCCESSFULLY: 'Fetched Task Details',
};
