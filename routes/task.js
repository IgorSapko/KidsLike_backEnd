//Core Express
const { Router } = require('express');
//Controllers
const taskController = require('../controllers/task');
const { validateToken } = require('../controllers/auth');
//Middleware
const multer = require('../middleware/multer-md');
//Helpers
const validate = require('../helpers/validate');
const tryCatchHandler = require('../helpers/tryCatchHandler');
const validationSchemas = require('../helpers/validationSchemas');

const {
	taskActiveOneSchema,
	taskDateSchema,
	createTaskSchema,
	taskActiveSchema,
	taskIdSchema,
} = validationSchemas;

const {
	createCustomTask,
	switchTaskActive,
	switchTaskActiveOne,
	switchTaskComplete,
} = taskController;

const taskRouter = Router();

// @ POST /api/task
taskRouter.post(
	'/',
	tryCatchHandler(validateToken),
	multer.single('taskAvatar'),
	validate(createTaskSchema),
	tryCatchHandler(createCustomTask),
);

// @ PATCH /api/task/active
taskRouter.patch(
	'/active',
	tryCatchHandler(validateToken),
	validate(taskActiveSchema),
	tryCatchHandler(switchTaskActive),
);

// @ PATCH /api/task/active-one/:taskId
taskRouter.patch(
	'/active-one/:taskId',
	tryCatchHandler(validateToken),
	validate(taskIdSchema, 'params'),
	validate(taskActiveOneSchema),
	tryCatchHandler(switchTaskActiveOne),
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
