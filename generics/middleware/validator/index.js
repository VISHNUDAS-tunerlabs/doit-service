/**
 * name 		: index.js
 * author 		: vishnu
 * Date 		: 30-Oct-2024
 * Description  : index.
 */

//dependencies
let fs = require('fs');

module.exports = (req, res, next) => {
  let validatorPath;
  if (req.params.file) {
    validatorPath =
      PROJECT_ROOT_DIRECTORY +
      `/module/${req.params.controller}/${req.params.file}/validator/${req.params.version}.js`;
  } else {
    validatorPath =
      PROJECT_ROOT_DIRECTORY +
      `/module/${req.params.controller}/validator/${req.params.version}.js`;
  }

  if (fs.existsSync(validatorPath)) require(validatorPath)(req);

  next();

  return;
};
