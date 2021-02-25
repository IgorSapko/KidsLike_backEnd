//Core Mongoose
const {
	Types: { ObjectId },
} = require('mongoose');
//Validate
const Joi = require('joi');
//Configs
const configs = require('../configs');

/**
 * =============== Authentication schemas =====================================
 */
const { userPassMin, userPassMax } = configs.users;

const authSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(userPassMin).max(userPassMax).required(),
});

/**
 * =============== Tasks schemas ==============================================
 */
const { rewardPointMin, dateRegex, tasksDayMin, tasksDayMax } = configs.tasks;

const createTaskSchema = Joi.object({
	title: Joi.string().required(),
	reward: Joi.number().required().min(rewardPointMin),
});

const taskIdSchema = Joi.object({
	taskId: Joi.string()
		.custom((value, helpers) =>
			!ObjectId.isValid(value) ? helpers.message({ message: 'Invalid taskId' }) : value,
		)
		.required(),
});

const taskDateSchema = Joi.object({
	date: Joi.string()
		.custom((value, helpers) =>
			!dateRegex.test(value)
				? helpers.message({ message: "Invalid 'date'. It should be dd-mm-yyyy string format" })
				: value,
		)
		.required(),
});

const taskActiveSchema = Joi.object({
	days: Joi.array().min(tasksDayMin).max(tasksDayMax).items(Joi.boolean()).required(),
});

/**
 * =============== Gifts schemas ==============================================
 */
const { gistCountMin, gistCountMax } = configs.gifts;

const buyGiftSchema = Joi.object({
	giftIds: Joi.array().min(gistCountMin).max(gistCountMax).unique().required(),
});

module.exports = {
	authSchema,
	createTaskSchema,
	taskIdSchema,
	taskDateSchema,
	taskActiveSchema,
	buyGiftSchema,
};
