/**
 * name : v1.js
 * author : Prajwal
 * created-date : 15-Apr-2024
 * Description : Admin.
 */

module.exports = (req) => {

    let adminValidator = {
        createIndex : function() {
            req.checkParams('_id').exists().withMessage("required collection name")
            req.checkBody("keys").exists().withMessage("keys required")
        }
    }

    if (adminValidator[req.params.method]) {
        adminValidator[req.params.method]();
    }

};