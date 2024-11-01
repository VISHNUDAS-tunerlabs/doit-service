module.exports = (req) => {
  let tasksValidator = {
    create: function () {
      req.checkBody('title').trim().notEmpty().withMessage('Title is required.');

      req.checkBody('description').trim().notEmpty().withMessage('Description is required.');

      req
        .checkBody('priority')
        .trim()
        .notEmpty()
        .withMessage('Priority is required.')
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be one of: low, medium, high.');
      req.checkBody('assignedTo').trim().notEmpty().withMessage('assignedTo is required.');
    },
    update: function () {
      // Check if _id parameter is provided and is a valid MongoDB ObjectId
      req
        .checkParams('_id')
        .notEmpty()
        .withMessage('_id parameter is required.')
        .isMongoId()
        .withMessage('_id must be a valid MongoDB ObjectId.');

      // Check if title is present, then ensure it is not empty
      if (req.body.title !== undefined) {
        req.checkBody('title').notEmpty().withMessage('Title cannot be empty.');
      }

      // Check if description is present, then ensure it is not empty
      if (req.body.description !== undefined) {
        req.checkBody('description').notEmpty().withMessage('Description cannot be empty.');
      }

      // Check if priority is present, then ensure it is one of the allowed values
      if (req.body.priority !== undefined) {
        req
          .checkBody('priority')
          .notEmpty()
          .withMessage('Priority cannot be empty.')
          .isIn(['low', 'medium', 'high'])
          .withMessage('Priority must be one of: low, medium, high.');
      }

      // Check if status is present, then ensure it is one of the allowed values
      if (req.body.status !== undefined) {
        req
          .checkBody('status')
          .notEmpty()
          .withMessage('Status cannot be empty.')
          .isIn(['assigned', 'started', 'completed', 'verified'])
          .withMessage('Status must be one of: assigned, started, completed, verified.');
      }

      // Check if isDeleted is present, then ensure it is a boolean
      if (req.body.isDeleted !== undefined) {
        req.checkBody('isDeleted').isBoolean().withMessage('isDeleted must be a boolean.');
      }
    },
    read: function () {
      // if (req.params._id || Object.keys(req.body).length !== 0) {
      // 	if (req.params._id) {
      // 		req.checkParams('_id').notEmpty().withMessage('id param is empty')
      // 	} else {
      // 		req.checkBody('type').trim().notEmpty().withMessage('type field is empty')
      // 		// .matches(/^[A-Za-z]+$/)
      // 		// .withMessage('type is invalid')
      // 		req.checkBody('subType').trim().notEmpty().withMessage('subType field is empty')
      // 		// .matches(/^[A-Za-z]+$/)
      // 		// .withMessage('subType is invalid')
      // 	}
      // }
    },
  };

  if (tasksValidator[req.params.method]) {
    tasksValidator[req.params.method]();
  }
};
