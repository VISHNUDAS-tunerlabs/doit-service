/**
 * name 			: envVariables.js.
 * author 			: vishnu.
 * created-date 	: 30-June-2024.
 * Description 		: Required Environment variables .
 */

const Log = require('log');
let log = new Log('debug');
let table = require('cli-table');

let tableData = new table();

let enviromentVariables = {
  APPLICATION_PORT: {
    message: 'Please specify the value for e.g. 4201',
    optional: false,
  },
  APPLICATION_ENV: {
    message: 'Please specify the value for e.g. local/development/qa/production',
    optional: false,
  },
  MONGODB_URL: {
    message: 'Required mongodb url',
    optional: false,
  },
  INTERNAL_ACCESS_TOKEN: {
    message: 'Required internal access token',
    optional: false,
  },
  APP_PORTAL_BASE_URL: {
    message: 'App Portal base url required',
    optional: false,
    default: 'https://dev.elevate.org',
  },
  API_DOC_URL: {
    message: 'Required api doc url',
    optional: false,
  },
};

let success = true;

module.exports = function () {
  Object.keys(enviromentVariables).forEach((eachEnvironmentVariable) => {
    let tableObj = {
      [eachEnvironmentVariable]: 'PASSED',
    };

    let keyCheckPass = true;
    let validRequiredIfOperators = ['EQUALS', 'NOT_EQUALS'];

    if (
      enviromentVariables[eachEnvironmentVariable].optional === true &&
      enviromentVariables[eachEnvironmentVariable].requiredIf &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.key &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.key != '' &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.operator &&
      validRequiredIfOperators.includes(
        enviromentVariables[eachEnvironmentVariable].requiredIf.operator,
      ) &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.value &&
      enviromentVariables[eachEnvironmentVariable].requiredIf.value != ''
    ) {
      switch (enviromentVariables[eachEnvironmentVariable].requiredIf.operator) {
        case 'EQUALS':
          if (
            process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] ===
            enviromentVariables[eachEnvironmentVariable].requiredIf.value
          ) {
            enviromentVariables[eachEnvironmentVariable].optional = false;
          }
          break;
        case 'NOT_EQUALS':
          if (
            process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] !=
            enviromentVariables[eachEnvironmentVariable].requiredIf.value
          ) {
            enviromentVariables[eachEnvironmentVariable].optional = false;
          }
          break;
        default:
          break;
      }
    }

    if (enviromentVariables[eachEnvironmentVariable].optional === false) {
      if (!process.env[eachEnvironmentVariable] || process.env[eachEnvironmentVariable] == '') {
        keyCheckPass = false;
        if (
          enviromentVariables[eachEnvironmentVariable].default &&
          enviromentVariables[eachEnvironmentVariable].default != ''
        ) {
          process.env[eachEnvironmentVariable] =
            enviromentVariables[eachEnvironmentVariable].default;
          keyCheckPass = true;
        } else {
          success = false;
        }
      } else if (
        enviromentVariables[eachEnvironmentVariable].possibleValues &&
        Array.isArray(enviromentVariables[eachEnvironmentVariable].possibleValues) &&
        enviromentVariables[eachEnvironmentVariable].possibleValues.length > 0
      ) {
        if (
          !enviromentVariables[eachEnvironmentVariable].possibleValues.includes(
            process.env[eachEnvironmentVariable],
          )
        ) {
          success = false;
          keyCheckPass = false;
          enviromentVariables[
            eachEnvironmentVariable
          ].message += ` Valid values - ${enviromentVariables[
            eachEnvironmentVariable
          ].possibleValues.join(', ')}`;
        }
      }
    }

    if (!keyCheckPass) {
      if (enviromentVariables[eachEnvironmentVariable].message !== '') {
        tableObj[eachEnvironmentVariable] = enviromentVariables[eachEnvironmentVariable].message;
      } else {
        tableObj[eachEnvironmentVariable] = `FAILED - ${eachEnvironmentVariable} is required`;
      }
    }
    tableData.push(tableObj);
  });

  log.info(tableData.toString());
  return {
    success: success,
  };
};
