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
  GOTENBERG_URL: {
    message: 'Gotenberg url required',
    optional: false,
  },
  KAFKA_COMMUNICATIONS_ON_OFF: {
    message: 'Enable/Disable kafka communications',
    optional: false,
  },
  // "KAFKA_URL" : {
  //   "message" : "Required",
  //   "optional" : false
  // },
  SERVICE_NAME: {
    message: 'Project service name required',
    optional: false,
    default: 'project',
  },
  CERTIFICATE_SERVICE_URL: {
    message: 'certificate service base url',
    optional: true,
    default: 'http://registry-service:8081',
    requiredIf: {
      key: 'PROJECT_CERTIFICATE_ON_OFF',
      operator: 'EQUALS',
      value: 'ON',
    },
  },
  PROJECT_CERTIFICATE_ON_OFF: {
    message: 'Enable/Disable project certification',
    optional: false,
    default: 'ON',
  },
  // cloud service variables
  CLOUD_STORAGE_PROVIDER: {
    message: 'Require cloud storage provider',
    optional: false,
  },
  CLOUD_STORAGE_BUCKETNAME: {
    message: 'Require client storage bucket name',
    optional: false,
  },
  CLOUD_STORAGE_SECRET: {
    message: 'Require client storage provider identity',
    optional: false,
  },
  CLOUD_STORAGE_ACCOUNTNAME: {
    message: 'Require client storage account name',
    optional: false,
  },
  ALLOWED_HOST: {
    message: 'Required CORS allowed host',
    optional: true,
    default: '*',
  },
  // signedUrl and downloadAble url expiry durations
  DOWNLOADABLE_URL_EXPIRY_IN_SECONDS: {
    message: 'Required downloadable url expiration time',
    optional: false,
    default: 300,
  },
  PRESIGNED_URL_EXPIRY_IN_SECONDS: {
    message: 'Required presigned url expiration time',
    optional: false,
    default: 300,
  },
  // default organisation code
  DEFAULT_ORGANISATION_CODE: {
    message: 'Default Organization Id/Code is required',
    optional: false,
  },
  APP_PORTAL_BASE_URL: {
    message: 'App Portal base url required',
    optional: false,
    default: 'https://dev.elevate.org',
  },
  TIMEZONE_DIFFRENECE_BETWEEN_LOCAL_TIME_AND_UTC: {
    message: 'Timezone diffrence required',
    optional: false,
  },
  ELEVATE_PROJECT_SERVICE_URL: {
    message: 'Elevate project service url required',
    optional: false,
  },
  API_DOC_URL: {
    message: 'Required api doc url',
    optional: false,
  },
  INTERFACE_SERVICE_URL: {
    message: 'Interface service url required',
    optional: false,
  },
  USER_SERVICE_BASE_URL: {
    message: 'User service name required',
    optional: false,
  },
  ENTITY_MANAGEMENT_SERVICE_BASE_URL: {
    message: 'Entity management service name required',
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
