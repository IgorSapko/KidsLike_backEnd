//Validate
const Joi = require('joi');
//Configs
const configs = require('../configs');

const {
	userPassLengthMin,
	userPassLengthMax,
	usernameLengthMin,
	usernameLengthMax,
} = configs.users;

const signUpSchema = Joi.object({
	username: Joi.string().min(usernameLengthMin).max(usernameLengthMax).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(userPassLengthMin).max(userPassLengthMax).required(),
});

const signInSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(userPassLengthMin).max(userPassLengthMax).required(),
});

module.exports = {
	signUpSchema,
	signInSchema,
};
