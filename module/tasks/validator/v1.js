module.exports = (req) => {
  let tasksValidator = {
    create: function () {
      req.checkBody('title').trim().notEmpty().withMessage('Title is required.');

      req.checkBody('description').trim().notEmpty().withMessage('Description is required.');

      req.checkBody('assigneeName').trim().notEmpty().withMessage('Assignee Name is required.');

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

      if (req.body.assigneeName !== undefined) {
        req.checkBody('assigneeName').notEmpty().withMessage('Assignee Name cannot be empty.');
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
          .isIn(['assigned', 'started', 'completed'])
          .withMessage('Status must be one of: assigned, started, completed.');
      }

      // Check if isDeleted is present, then ensure it is a boolean
      if (req.body.isDeleted !== undefined) {
        req.checkBody('isDeleted').isBoolean().withMessage('isDeleted must be a boolean.');
      }
    },
    read: function () {
      // Check if _id parameter is provided and is a valid MongoDB ObjectId
      req
        .checkParams('_id')
        .notEmpty()
        .withMessage('_id parameter is required.')
        .isMongoId()
        .withMessage('_id must be a valid MongoDB ObjectId.');
    },
    list: function () {},
  };

  if (tasksValidator[req.params.method]) {
    tasksValidator[req.params.method]();
  }
};
