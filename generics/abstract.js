/**
 * name         : abstract.js
 * author 		  : vishnu
 * Date 		    : 30-Oct-2024
 * Description  : Abstract class.
 */

/**
 * Abstract
 * @class
 */

let Abstract = class Abstract {
  constructor(schema) {
    database.createModel(schemas[schema]);
    if (schemas[schema].compoundIndex && schemas[schema].compoundIndex.length > 0) {
      database.runCompoundIndex(schemas[schema].name, schemas[schema].compoundIndex);
    }
  }
};

module.exports = Abstract;
