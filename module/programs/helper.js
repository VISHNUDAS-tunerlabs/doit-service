/**
 * name : helper.js
 * author : Aman
 * created-date : 03-sep-2020
 * Description : Programs related helper functionality.
 */

// Dependencies

const timeZoneDifference = process.env.TIMEZONE_DIFFRENECE_BETWEEN_LOCAL_TIME_AND_UTC
const programsQueries = require(DB_QUERY_BASE_PATH + '/programs')
const entitiesService = require(GENERICS_FILES_PATH + '/services/entity-management')

/**
 * ProgramsHelper
 * @class
 */
module.exports = class ProgramsHelper {
	/**
	 * Set scope in programs
	 * @method
	 * @name setScope
	 * @param {String} programId - program id.
	 * @param {Object} scopeData - scope data.
	 * @param {String} scopeData.entityType - scope entity type
	 * @param {Array} scopeData.entities - scope entities
	 * @param {Array} scopeData.roles - roles in scope
	 * @returns {JSON} - scope in programs.
	 */

	static setScope(programId, scopeData) {
		return new Promise(async (resolve, reject) => {
			try {
				let programData = await programsQueries.programsDocument({ _id: programId }, ['_id'])

				if (!programData.length > 0) {
					return resolve({
						status: HTTP_STATUS_CODE.bad_request.status,
						message: CONSTANTS.apiResponses.PROGRAM_NOT_FOUND,
					})
				}

				let scopeKeys = Object.keys(scopeData).map((key) => {
					return `scope.${key}`
				})

				let programIndexedKeys = await programsQueries.listIndexes()
				let indexes = programIndexedKeys.map((indexedKeys) => {
					return Object.keys(indexedKeys.key)[0]
				})
				let keysNotIndexed = _.differenceWith(scopeKeys, indexes)
				// if (Object.keys(scopeData).length > 0) {
				//   if (scopeData.entityType) {
				//     let bodyData = { name: scopeData.entityType };
				//     let entityTypeData = await entityTypesHelper.list(bodyData);
				//     if (entityTypeData.length > 0) {
				//       currentSolutionScope.entityType = entityTypeData[0].name;
				//     }
				//   }

				//   if (scopeData.entities && scopeData.entities.length > 0) {
				//     //call learners api for search
				//     let entityIds = [];
				//     let locationData = gen.utils.filterLocationIdandCode(scopeData.entities);

				//     if (locationData.codes.length > 0) {
				//       let filterData = {
				//         'registryDetails.code': locationData.codes,
				//         entityType: currentSolutionScope.entityType,
				//       };
				//       let entityDetails = await entitiesHelper.entitiesDocument(filterData);

				//       if (entityDetails.success) {
				//         entityDetails.data.forEach((entity) => {
				//           entityIds.push(entity.id);
				//         });
				//       }
				//     }
				//     entityIds = [...locationData.ids, ...locationData.codes];

				//     if (!entityIds.length > 0) {
				//       return resolve({
				//         status: HTTP_STATUS_CODE.bad_request.status,
				//         message: CONSTANTS.apiResponses.ENTITIES_NOT_FOUND,
				//       });
				//     }

				//     let entitiesData = [];

				//     // if( currentSolutionScope.entityType !== programData[0].scope.entityType ) {
				//     //   let result = [];
				//     //   let childEntities = await userService.getSubEntitiesBasedOnEntityType(currentSolutionScope.entities, currentSolutionScope.entityType, result);
				//     //   if( childEntities.length > 0 ) {
				//     //     entitiesData = entityIds.filter(element => childEntities.includes(element));
				//     //   }
				//     // } else {
				//     entitiesData = entityIds;
				//     // }

				//     if (!entitiesData.length > 0) {
				//       return resolve({
				//         status: HTTP_STATUS_CODE.bad_request.status,
				//         message: CONSTANTS.apiResponses.SCOPE_ENTITY_INVALID,
				//       });
				//     }

				//     currentSolutionScope.entities = entitiesData;
				//   }

				//   // currentSolutionScope.recommendedFor = scopeData.recommendedFor;

				//   // if (scopeData.roles) {
				//   //   if (Array.isArray(scopeData.roles) && scopeData.roles.length > 0) {
				//   //     let userRoles = await userRolesHelper.list(
				//   //       {
				//   //         code: { $in: scopeData.roles },
				//   //       },
				//   //       ['_id', 'code'],
				//   //     );

				//   //     if (!userRoles.length > 0) {
				//   //       return resolve({
				//   //         status: HTTP_STATUS_CODE.bad_request.status,
				//   //         message: CONSTANTS.apiResponses.INVALID_ROLE_CODE,
				//   //       });
				//   //     }

				//   //     currentSolutionScope['roles'] = userRoles;
				//   //   } else {
				//   //     if (scopeData.roles === CONSTANTS.common.ALL_ROLES) {
				//   //       currentSolutionScope['roles'] = [
				//   //         {
				//   //           code: CONSTANTS.common.ALL_ROLES,
				//   //         },
				//   //       ];
				//   //     }
				//   //   }
				//   // }
				// }

				if (keysNotIndexed.length > 0) {
					// Map over keysNotIndexed to extract the part after the first dot
					let keysCannotBeAdded = keysNotIndexed.map((keys) => {
						return keys.split('.')[1]
					})
					scopeData = _.omit(scopeData, keysCannotBeAdded)
				}

				const updateObject = {
					$set: {},
				}

				// Set the scope in updateObject to the updated scopeData
				updateObject['$set']['scope'] = scopeData

				// Extract entities from scopeData excluding the 'roles' key
				const entities = Object.keys(scopeData)
					.filter((key) => key !== 'roles')
					.reduce((acc, key) => acc.concat(scopeData[key]), [])

				// Add the entities array to updateObject
				updateObject.$set.entities = entities

				// Join all keys except 'roles' into a comma-separated string and set it as entityType
				scopeData['entityType'] = Object.keys(_.omit(scopeData, ['roles'])).join(',')

				// Add the entityType to updateObject
				updateObject['$set']['entityType'] = scopeData.entityType

				// Find and update the program with the specified programId
				let updateProgram = await programsQueries.findAndUpdate(
					{
						_id: programId,
					},
					updateObject,
					{ new: true }
				)

				// Check if the update was successful by verifying the presence of an _id
				if (!updateProgram._id) {
					// If the update was not successful, throw an error with the appropriate status
					throw {
						status: CONSTANTS.apiResponses.PROGRAM_SCOPE_NOT_ADDED,
					}
				}
				programData = updateProgram

				// Prepare the result object with the updated scope and programId
				let result = { _id: programId, scope: updateProgram.scope }

				// Resolve the promise with a success message and the result
				return resolve({
					success: true,
					message: CONSTANTS.apiResponses.PROGRAM_UPDATED,
					result: result,
				})
			} catch (error) {
				return resolve({
					message: error.message,
					success: false,
				})
			}
		})
	}

	/**
	 * Create program
	 * @method
	 * @name create
	 * @param {Array} data
	 * @param {Boolean} checkDate this is true for when its called via API calls
	 * @returns {JSON} - create program.
	 */

	static create(data, userId = '', checkDate = false) {
		return new Promise(async (resolve, reject) => {
			try {
				let programData = {
					isDeleted: false,
					status: CONSTANTS.common.ACTIVE_STATUS,
					components: [],
					isAPrivateProgram: data.isAPrivateProgram ? data.isAPrivateProgram : false,
					owner: userId == '' ? data.userId : userId,
					createdBy: userId == '' ? data.userId : userId,
					updatedBy: userId == '' ? data.userId : userId,
				}

				if (checkDate) {
					if (data.hasOwnProperty(CONSTANTS.common.END_DATE)) {
						data.endDate = UTILS.getEndDate(data.endDate, timeZoneDifference)
					}
					if (data.hasOwnProperty(CONSTANTS.common.START_DATE)) {
						data.startDate = UTILS.getStartDate(data.startDate, timeZoneDifference)
					}
				}

				_.assign(programData, {
					...data,
				})
				programData = _.omit(programData, ['scope', 'userId'])
				let program = await programsQueries.createProgram(programData)

				if (!program._id) {
					throw {
						message: CONSTANTS.apiResponses.PROGRAM_NOT_CREATED,
					}
				}

				if (data.scope) {
					let programScopeUpdated = await this.setScope(program._id, data.scope)

					if (!programScopeUpdated.success) {
						throw {
							message: CONSTANTS.apiResponses.SCOPE_NOT_UPDATED_IN_PROGRAM,
						}
					}
				}

				return resolve({
					success: true,
					message: CONSTANTS.apiResponses.PROGRAMS_CREATED,
					data: program,
					result: program,
				})
			} catch (error) {
				return reject(error)
			}
		})
	}

	/**
	 * Update program
	 * @method
	 * @name update
	 * @param {String} programId - program id.
	 * @param {Array} data
	 * @param {String} userId
	 * @param {Boolean} checkDate this is true for when its called via API calls
	 * @returns {JSON} - update program.
	 */

	static update(programId, data, userId, checkDate = false) {
		return new Promise(async (resolve, reject) => {
			try {
				data.updatedBy = userId
				data.updatedAt = new Date()
				//convert components to objectedIds
				if (data.components && data.components.length > 0) {
					data.components = data.components.map((component) => UTILS.convertStringToObjectId(component))
				}

				if (checkDate) {
					if (data.hasOwnProperty(CONSTANTS.common.END_DATE)) {
						data.endDate = UTILS.getEndDate(data.endDate, timeZoneDifference)
					}
					if (data.hasOwnProperty(CONSTANTS.common.START_DATE)) {
						data.startDate = UTILS.getStartDate(data.startDate, timeZoneDifference)
					}
				}

				let program = await programsQueries.findAndUpdate(
					{
						_id: programId,
					},
					{ $set: _.omit(data, ['scope']) },
					{ new: true }
				)

				if (!program || !program._id) {
					throw {
						message: CONSTANTS.apiResponses.PROGRAM_NOT_UPDATED,
					}
				}

				if (data.scope) {
					let programScopeUpdated = await this.setScope(programId, data.scope)

					if (!programScopeUpdated.success) {
						throw {
							message: CONSTANTS.apiResponses.SCOPE_NOT_UPDATED_IN_PROGRAM,
						}
					}
				}

				return resolve({
					success: true,
					message: CONSTANTS.apiResponses.PROGRAMS_UPDATED,
					data: {
						_id: programId,
					},
					result: {
						_id: programId,
					},
				})
			} catch (error) {
				return resolve({
					success: false,
					message: error.message,
					data: {},
				})
			}
		})
	}

	/**
	 * Program details.
	 * @method
	 * @name details
	 * @param {String} programId - Program Id.
	 * @returns {Object} - Details of the program.
	 */

	static details(programId) {
		return new Promise(async (resolve, reject) => {
			try {
				let programData = await programsQueries.programsDocument({
					_id: programId,
				})

				if (!programData.length > 0) {
					return resolve({
						status: HTTP_STATUS_CODE.bad_request.status,
						message: CONSTANTS.apiResponses.PROGRAM_NOT_FOUND,
					})
				}

				return resolve({
					message: CONSTANTS.apiResponses.PROGRAMS_FETCHED,
					success: true,
					data: programData[0],
					result: programData[0],
				})
			} catch (error) {
				return resolve({
					success: false,
					status: error.status ? error.status : HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message,
				})
			}
		})
	}

	/**
	 * Add roles in program.
	 * @method
	 * @name addRolesInScope
	 * @param {String} programId - Program Id.
	 * @param {Array} roles - roles data.
	 * @returns {JSON} - Added roles data.
	 */

	static addRolesInScope(programId, roles) {
		return new Promise(async (resolve, reject) => {
			try {
				let programData = await programsQueries.programsDocument(
					{
						_id: programId,
						scope: { $exists: true },
						isAPrivateProgram: false,
					},
					['_id']
				)

				if (!programData.length > 0) {
					return resolve({
						status: HTTP_STATUS_CODE.bad_request.status,
						message: CONSTANTS.apiResponses.PROGRAM_NOT_FOUND,
					})
				}

				let updateQuery = {}

				if (Array.isArray(roles) && roles.length > 0) {
					let currentRoles = await programsQueries.programsDocument({ _id: programId }, ['scope.roles'])
					currentRoles = currentRoles[0].scope.roles

					let currentRolesSet = new Set(currentRoles)
					let rolesSet = new Set(roles)

					rolesSet.forEach((role) => {
						if (role != '' && role != 'all') currentRolesSet.add(role)
					})

					currentRoles = Array.from(currentRolesSet)
					updateQuery['$set'] = {
						'scope.roles': currentRoles,
					}
				} else {
					return resolve({
						status: HTTP_STATUS_CODE.bad_request.status,
						message: CONSTANTS.apiResponses.INVALID_ROLE_CODE,
					})
				}

				let updateProgram = await programsQueries.findAndUpdate(
					{
						_id: programId,
					},
					updateQuery,
					{ new: true }
				)

				if (!updateProgram || !updateProgram._id) {
					throw {
						message: CONSTANTS.apiResponses.PROGRAM_NOT_UPDATED,
					}
				}

				return resolve({
					message: CONSTANTS.apiResponses.ROLES_ADDED_IN_PROGRAM,
					success: true,
				})
			} catch (error) {
				return resolve({
					success: false,
					status: error.status ? error.status : HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message,
				})
			}
		})
	}

	/**
	 * Add entities in program.
	 * @method
	 * @name addEntitiesInScope
	 * @param {String} programId - Program Id.
	 * @param {Array} entities - entities data.
	 * @returns {JSON} - Added entities data.
	 */

	static addEntitiesInScope(programId, entities) {
		return new Promise(async (resolve, reject) => {
			try {
				let programData = await programsQueries.programsDocument(
					{
						_id: programId,
						scope: { $exists: true },
						isAPrivateProgram: false,
					},
					['_id', 'scope.entityType']
				)

				if (!programData.length > 0) {
					throw {
						message: CONSTANTS.apiResponses.PROGRAM_NOT_FOUND,
					}
				}

				let entitiesData = await entitiesService.entityDocuments(
					{
						_id: { $in: entities },
						entityType: programData[0].scope.entityType,
					},
					['_id']
				)

				if (!entitiesData.success || !entitiesData.data.length > 0) {
					throw {
						message: CONSTANTS.apiResponses.ENTITIES_NOT_FOUND,
					}
				}
				entitiesData = entitiesData.data
				let entityIds = []

				entitiesData.forEach((entity) => {
					entityIds.push(entity._id)
				})
				let updateObject = {
					$addToSet: {},
				}
				updateObject['$addToSet'][`scope.${programData[0].scope.entityType}`] = { $each: entityIds }

				let updateProgram = await programsQueries.findAndUpdate(
					{
						_id: programId,
					},
					updateObject,
					{ new: true }
				)

				if (!updateProgram || !updateProgram._id) {
					throw {
						message: CONSTANTS.apiResponses.PROGRAM_NOT_UPDATED,
					}
				}

				return resolve({
					message: CONSTANTS.apiResponses.ENTITIES_ADDED_IN_PROGRAM,
					success: true,
				})
			} catch (error) {
				return resolve({
					success: false,
					status: error.status ? error.status : HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message,
				})
			}
		})
	}

	/**
	 * remove roles in program.
	 * @method
	 * @name removeRolesInScope
	 * @param {String} programId - Program Id.
	 * @param {Array} roles - roles data.
	 * @returns {JSON} - Added roles data.
	 */

	static removeRolesInScope(programId, roles) {
		return new Promise(async (resolve, reject) => {
			try {
				let programData = await programsQueries.programsDocument(
					{
						_id: programId,
						scope: { $exists: true },
						isAPrivateProgram: false,
					},
					['_id']
				)

				if (!programData.length > 0) {
					return resolve({
						status: HTTP_STATUS_CODE.bad_request.status,
						message: CONSTANTS.apiResponses.PROGRAM_NOT_FOUND,
					})
				}

				if (Array.isArray(roles) && roles.length > 0) {
					let updateProgram = await programsQueries.findAndUpdate(
						{
							_id: programId,
						},
						{
							$pull: { 'scope.roles': { $in: roles } },
						},
						{ new: true }
					)

					if (!updateProgram || !updateProgram._id) {
						throw {
							message: CONSTANTS.apiResponses.PROGRAM_NOT_UPDATED,
						}
					}
				} else {
					return resolve({
						status: HTTP_STATUS_CODE.bad_request.status,
						message: CONSTANTS.apiResponses.INVALID_ROLE_CODE,
					})
				}

				return resolve({
					message: CONSTANTS.apiResponses.ROLES_REMOVED_IN_PROGRAM,
					success: true,
				})
			} catch (error) {
				return resolve({
					success: false,
					status: error.status ? error.status : HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message,
				})
			}
		})
	}

	/**
	 * remove entities in program scope.
	 * @method
	 * @name removeEntitiesInScope
	 * @param {String} programId - Program Id.
	 * @param {Array} entities - entities.
	 * @returns {JSON} - Removed entities data.
	 */

	static removeEntitiesInScope(programId, entities) {
		return new Promise(async (resolve, reject) => {
			try {
				let programData = await programsQueries.programsDocument(
					{
						_id: programId,
						scope: { $exists: true },
						isAPrivateProgram: false,
					},
					['_id', 'scope.entityType']
				)

				if (!programData.length > 0) {
					throw {
						message: CONSTANTS.apiResponses.PROGRAM_NOT_FOUND,
					}
				}
				let entitiesData = await entitiesService.entityDocuments(
					{
						_id: { $in: entities },
						entityType: programData[0].scope.entityType,
					},
					['_id']
				)

				if (!entitiesData.success || !entitiesData.data.length > 0) {
					throw {
						message: CONSTANTS.apiResponses.ENTITIES_NOT_FOUND,
					}
				}
				entitiesData = entitiesData.data
				let entityIds = []

				entitiesData.forEach((entity) => {
					entityIds.push(entity._id)
				})
				let updateObject = {
					$pull: {},
				}
				updateObject['$pull'][`scope.${programData[0].scope.entityType}`] = { $in: entityIds }
				let updateProgram = await programsQueries.findAndUpdate(
					{
						_id: programId,
					},
					updateObject,
					{ new: true }
				)

				if (!updateProgram || !updateProgram._id) {
					throw {
						message: CONSTANTS.apiResponses.PROGRAM_NOT_UPDATED,
					}
				}

				return resolve({
					message: CONSTANTS.apiResponses.ENTITIES_REMOVED_IN_PROGRAM,
					success: true,
				})
			} catch (error) {
				return resolve({
					success: false,
					status: error.status ? error.status : HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message,
				})
			}
		})
	}

	/**
	 * Program join.
	 * @method
	 * @name join
	 * @param {String} programId - Program Id.
	 * @param {Object} data - body data (can include isResourse flag && userRoleInformation).
	 * @param {String} userId - Logged in user id.
	 * @param {String} userToken - User token.
	 * @param {String} [appName = ""] - App Name.
	 * @param {String} [appVersion = ""] - App Version.
	 * @param {Boolean} callConsetAPIOnBehalfOfUser - required to call consent api or not
	 * @returns {Object} - Details of the program join.
	 */

	static join(
		programId,
		data,
		userId,
		userToken,
		appName = '',
		appVersion = '',
		callConsetAPIOnBehalfOfUser = false
	) {
		return new Promise(async (resolve, reject) => {
			try {
				let pushProgramUsersDetailsToKafka = false
				//Using programId fetch program details. Also checking the program status in the query.
				let programData = await programsQueries.programsDocument(
					{
						_id: programId,
						status: CONSTANTS.common.ACTIVE_STATUS,
						isDeleted: false,
					},
					['name', 'externalId', 'requestForPIIConsent', 'rootOrganisations']
				)

				if (!programData.length > 0) {
					throw {
						status: HTTP_STATUS_CODE.bad_request.status,
						message: CONSTANTS.apiResponses.PROGRAM_NOT_FOUND,
					}
				}
				let programUsersData = {}
				let update = {}

				// check if user already joined for program or not
				// const programUsersDetails =
				//   await programUsersHelper.programUsersDocuments(
				//     {
				//       userId: userId,
				//       programId: programId,
				//     },
				//     ["_id", "consentShared"]
				//   );
				// // if user not joined for program. we have add more key values to programUsersData
				// if (!programUsersDetails.length > 0) {
				//   // Fetch user profile information by calling sunbird's user read api.
				//   // !Important check specific fields of userProfile.
				//   let userProfile = await userService.profile(userToken, userId);
				//   if (
				//     !userProfile.success ||
				//     !userProfile.data ||
				//     !userProfile.data.profileUserTypes ||
				//     !userProfile.data.profileUserTypes.length > 0 ||
				//     !userProfile.data.userLocations ||
				//     !userProfile.data.userLocations.length > 0
				//   ) {
				//     throw {
				//       status: HTTP_STATUS_CODE.bad_request.status,
				//       message: CONSTANTS.apiResponses.PROGRAM_JOIN_FAILED,
				//     };
				//   }
				//   programUsersData = {
				//     programId: programId,
				//     userRoleInformation: data.userRoleInformation,
				//     userId: userId,
				//     userProfile: userProfile.data,
				//     resourcesStarted: false,
				//   };
				//   if (appName != "") {
				//     programUsersData["appInformation.appName"] = appName;
				//   }
				//   if (appVersion != "") {
				//     programUsersData["appInformation.appVersion"] = appVersion;
				//   }

				//   //For internal calls add consent using sunbird api
				//   if (
				//     callConsetAPIOnBehalfOfUser &&
				//     programData[0].hasOwnProperty("requestForPIIConsent") &&
				//     programData[0].requestForPIIConsent === true
				//   ) {
				//     if (
				//       !programData[0].rootOrganisations ||
				//       !programData[0].rootOrganisations.length > 0
				//     ) {
				//       throw {
				//         message: CONSTANTS.apiResponses.PROGRAM_JOIN_FAILED,
				//         status: HTTP_STATUS_CODE.bad_request.status,
				//       };
				//     }
				//     let userConsentRequestBody = {
				//       request: {
				//         consent: {
				//           status: CONSTANTS.common.REVOKED,
				//           userId: userProfile.data.id,
				//           consumerId: programData[0].rootOrganisations[0],
				//           objectId: programId,
				//           objectType: CONSTANTS.common.PROGRAM,
				//         },
				//       },
				//     };
				//     let consentResponse = await userService.setUserConsent(
				//       userToken,
				//       userConsentRequestBody
				//     );

				//     if (!consentResponse.success) {
				//       throw {
				//         message: CONSTANTS.apiResponses.PROGRAM_JOIN_FAILED,
				//         status: HTTP_STATUS_CODE.bad_request.status,
				//       };
				//     }
				//   }
				// }

				// if requestForPIIConsent Is false and user not joined program till now then set pushProgramUsersDetailsToKafka = true;
				// if requestForPIIConsent == true and data.consentShared value is true which means user interacted with the consent popup set pushProgramUsersDetailsToKafka = true;
				// if programUsersDetails[0].consentShared === true which means the data is already pushed to Kafka once
				if (
					(programData[0].hasOwnProperty('requestForPIIConsent') &&
						programData[0].requestForPIIConsent === false &&
						!programUsersDetails.length > 0) ||
					(programData[0].hasOwnProperty('requestForPIIConsent') &&
						programData[0].requestForPIIConsent === true &&
						data.hasOwnProperty('consentShared') &&
						data.consentShared == true &&
						((programUsersDetails.length > 0 && programUsersDetails[0].consentShared === false) ||
							!programUsersDetails.length > 0))
				) {
					pushProgramUsersDetailsToKafka = true
				}

				//create or update query
				const query = {
					_id: programId,
					owner: userId,
				}
				//if a resource is started
				if (data.isResource) {
					programUsersData.resourcesStarted = true
				}
				//if user interacted with the consent-popup
				if (data.hasOwnProperty('consentShared')) {
					programUsersData.consentShared = data.consentShared
				}
				update['$set'] = programUsersData

				// add record to programUsers collection
				let joinProgram = await programsQueries.findAndUpdate(query, update, {
					new: true,
					upsert: true,
				})

				if (!joinProgram._id) {
					throw {
						message: CONSTANTS.apiResponses.PROGRAM_JOIN_FAILED,
						status: HTTP_STATUS_CODE.bad_request.status,
					}
				}

				let joinProgramDetails = joinProgram

				if (pushProgramUsersDetailsToKafka) {
					joinProgramDetails.programName = programData[0].name
					joinProgramDetails.programExternalId = programData[0].externalId
					joinProgramDetails.requestForPIIConsent = programData[0].requestForPIIConsent
					//  push programUsers details to kafka
					// await kafkaProducersHelper.pushProgramUsersToKafka(
					//   joinProgramDetails
					// );
				}

				return resolve({
					message: CONSTANTS.apiResponses.JOINED_PROGRAM,
					success: true,
					data: {
						_id: joinProgram._id,
					},
					result: {
						_id: joinProgram._id,
					},
				})
			} catch (error) {
				return resolve({
					success: false,
					status: error.status ? error.status : HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message,
				})
			}
		})
	}

	/**
	 * List program
	 * @method
	 * @name list
	 * @param {Number} pageNo - page no.
	 * @param {Number} pageSize - page size.
	 * @param {String} searchText - text to search.
	 *  @param {Object} filter - filter.
	 *  @param {Array} projection - projection.
	 * @returns {Object} - Programs list.
	 */

	static list(pageNo = '', pageSize = '', searchText, filter = {}, projection) {
		return new Promise(async (resolve, reject) => {
			try {
				let programDocument = []

				let matchQuery = { status: CONSTANTS.common.ACTIVE_STATUS }

				if (Object.keys(filter).length > 0) {
					matchQuery = _.merge(matchQuery, filter)
				}

				if (searchText !== '') {
					matchQuery['$or'] = []
					matchQuery['$or'].push(
						{
							externalId: new RegExp(searchText, 'i'),
						},
						{
							name: new RegExp(searchText, 'i'),
						},
						{
							description: new RegExp(searchText, 'i'),
						}
					)
				}

				let sortQuery = {
					$sort: { createdAt: -1 },
				}

				let projection1 = {}

				if (projection && projection.length > 0) {
					projection.forEach((projectedData) => {
						projection1[projectedData] = 1
					})
				} else {
					projection1 = {
						description: 1,
						externalId: 1,
						isAPrivateProgram: 1,
					}
				}

				let facetQuery = {}
				facetQuery['$facet'] = {}

				facetQuery['$facet']['totalCount'] = [{ $count: 'count' }]

				if (pageSize === '' && pageNo === '') {
					facetQuery['$facet']['data'] = [{ $skip: 0 }]
				} else {
					facetQuery['$facet']['data'] = [{ $skip: pageSize * (pageNo - 1) }, { $limit: pageSize }]
				}

				let projection2 = {}
				projection2['$project'] = {
					data: 1,
					count: {
						$arrayElemAt: ['$totalCount.count', 0],
					},
				}

				programDocument.push(
					{ $match: matchQuery },
					sortQuery,
					{ $project: projection1 },
					facetQuery,
					projection2
				)

				let programDocuments = await programsQueries.getAggregate(programDocument)
				return resolve({
					success: true,
					message: CONSTANTS.apiResponses.PROGRAM_LIST,
					data: programDocuments[0],
					result: programDocuments[0],
				})
			} catch (error) {
				return resolve({
					success: false,
					message: error.message,
					data: [],
				})
			}
		})
	}

	/**
	 * Remove solutions from program.
	 * @method
	 * @name removeSolutions
	 * @param {Array} programId - Program id.
	 * @param {Array} solutionIds - Program id.
	 * @returns {Array} Update program.
	 */

	static removeSolutions(userToken = '', programId, solutionIds) {
		return new Promise(async (resolve, reject) => {
			try {
				let programsData = await programQueries.programsDocument({ _id: programId }, ['_id'])

				if (!programsData.length > 0) {
					throw {
						status: HTTP_STATUS_CODE.bad_request.status,
						message: CONSTANTS.apiResponses.PROGRAM_NOT_FOUND,
					}
				}

				let updateSolutionIds = solutionIds.map((solutionId) => ObjectId(solutionId))

				let updateSolution = await programQueries.findAndUpdate(
					{
						_id: programId,
					},
					{
						$pull: {
							components: { $in: updateSolutionIds },
						},
					}
				)

				return resolve({
					success: true,
					message: CONSTANTS.apiResponses.PROGRAM_UPDATED_SUCCESSFULLY,
					data: updateSolution,
				})
			} catch (error) {
				return resolve({
					status: error.status ? error.status : HTTP_STATUS_CODE.internal_server_error.status,
					success: false,
					message: error.message,
					data: false,
				})
			}
		})
	}
}
