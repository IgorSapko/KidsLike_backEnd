//Core Express
const { Router } = require('express');
//Controllers
const taskController = require('../controllers/task');
const { validateToken } = require('../controllers/auth');
//Middleware
const { multerMd } = require('../middleware/multer-md');
//Helpers
const validate = require('../helpers/validate');
const tryCatchHandler = require('../helpers/tryCatchHandler');
const validationSchemas = require('../helpers/validationSchemas');

const { taskActiveSchema, taskDateSchema, createTaskSchema, taskIdSchema } = validationSchemas;
const { createCustomTask, switchTaskActive, switchTaskComplete } = taskController;

const taskRouter = Router();

// @ POST /api/task
taskRouter.post(
	'/',
	tryCatchHandler(validateToken),
	multerMd.single('taskAvatar'),
	validate(createTaskSchema),
	tryCatchHandler(createCustomTask),
);

// @ PATCH /api/task/active/:taskId
taskRouter.patch(
	'/active/:taskId',
	tryCatchHandler(validateToken),
	validate(taskIdSchema, 'params'),
	validate(taskActiveSchema),
	tryCatchHandler(switchTaskActive),
);

// @ PATCH /api/task/switch/:taskId
taskRouter.patch(
	'/switch/:taskId',
	tryCatchHandler(validateToken),
	validate(taskIdSchema, 'params'),
	validate(taskDateSchema),
	tryCatchHandler(switchTaskComplete),
);

module.exports = taskRouter;
