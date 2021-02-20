//Core
const { Router } = require('express');
//Controllers
const authController = require('../controllers/auth');
//Helpers
const validate = require('../helpers/validate');
const tryCatchHandler = require('../helpers/tryCatchHandler');
const validationSchemas = require('../helpers/validationSchemas');

const { signUpSchema, signInSchema } = validationSchemas;
const { signUpUser, signInUser, signOutUser, validateToken } = authController;

const authRouter = Router();

// @ POST /api/auth/sign-up
authRouter.post('/sign-up', validate(signUpSchema), tryCatchHandler(signUpUser));

// @ POST /api/auth/sign-in
authRouter.post('/sign-in', validate(signInSchema), tryCatchHandler(signInUser));

// @ POST /api/auth/sign-out
authRouter.post('/sign-out', tryCatchHandler(validateToken), tryCatchHandler(signOutUser));

module.exports = authRouter;
