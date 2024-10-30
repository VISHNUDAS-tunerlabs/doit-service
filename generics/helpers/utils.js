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
 * @param {String} string - String in hyphen case.
 * @returns {String} returns a camelCase string.
 */

function hyphenCaseToCamelCase(string) {
  return string.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

module.exports = {
  hyphenCaseToCamelCase: hyphenCaseToCamelCase,
};
