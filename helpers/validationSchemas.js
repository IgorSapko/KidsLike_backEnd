//Validate
const Joi = require('joi');
//Configs
const configs = require('../configs');

/**
 * =============== Authentication schemas =====================================
 */
const { usernameMin, usernameMax, userPassMin, userPassMax } = configs.users;

const signUpSchema = Joi.object({
	username: Joi.string().min(usernameMin).max(usernameMax).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(userPassMin).max(userPassMax).required(),
});

const signInSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(userPassMin).max(userPassMax).required(),
});

module.exports = {
	signUpSchema,
	signInSchema,
};
