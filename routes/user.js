//Core
const { Router } = require('express');
//Controllers
const { validateToken } = require('../controllers/auth');
const { getCurrentUser } = require('../controllers/user');
//Helpers
const tryCatchHandler = require('../helpers/tryCatchHandler');

const userRouter = Router();

// @ GET /api/user/current
userRouter.get('/current', tryCatchHandler(validateToken), tryCatchHandler(getCurrentUser));

module.exports = userRouter;
