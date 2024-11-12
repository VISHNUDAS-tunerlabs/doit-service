/**
 * name 		: utils.js
 * author 		: vishnu
 * Date 		: 30-Oct-2024
 * Description 	: All utility functions.
 */
// Dependencies

/**
 * Convert hyphen case string to camelCase.
 * @function
 * @name hyphenCaseToCamelCase
 * @param {String} string           - String in hyphen case.
 * @returns {String}                - returns a camelCase string.
 */

function hyphenCaseToCamelCase(string) {
  return string.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

/**
 * Generate task meta information based on the provided status.
 * @function
 * @name generateTaskMetaInformation
 * @param {String} status             - The current status of the task.
 * @returns {Object}                  - returns an object containing meta information.
 */

function generateTaskMetaInformation(status) {
  const statusMapping = {
    [CONSTANTS.common.STATUS_ASSIGNED]: { creatorStatus: 'assigned', assigneeStatus: 'start' },
    [CONSTANTS.common.STATUS_STARTED]: { creatorStatus: 'started', assigneeStatus: 'complete' },
    [CONSTANTS.common.STATUS_COMPLETED]: {
      creatorStatus: 'completed',
      assigneeStatus: 'completed',
    },
  };

  return statusMapping[status] || { creatorStatus: 'unknown', assigneeStatus: 'unknown' };
}

module.exports = {
  hyphenCaseToCamelCase: hyphenCaseToCamelCase,
  generateTaskMetaInformation: generateTaskMetaInformation,
};
