//Models
const userModel = require('../models/user');
const weekModel = require('../models/week');
const taskModel = require('../models/task');
//Utils
const createDaysOfWeek = require('../utils/createDaysOfWeek');

//!Temp decision
const defaultImage =
	'https://creazilla-store.fra1.digitaloceanspaces.com/emojis/57178/robot-emoji-clipart-md.png';

async function createCustomTask(req, res) {
	const {
		body: { title, reward },
		user,
	} = req;

	const imageUrl = defaultImage;
	const daysOfWeek = createDaysOfWeek();

	const task = await taskModel.create({
		title,
		reward: parseInt(reward),
		imageUrl,
		days: daysOfWeek,
	});

	await weekModel.findByIdAndUpdate(
		user.currentWeek,
		{ $push: { tasks: task._id } },
		{ new: true },
	);

	const response = { title, reward: parseInt(reward), imageUrl, id: task._id, days: task.days };

	return res.status(201).json(response);
}

async function switchTaskActive(req, res) {}

async function switchTaskActiveOne(req, res) {}

async function switchTaskComplete(req, res) {}

module.exports = {
	createCustomTask,
	switchTaskActive,
	switchTaskActiveOne,
	switchTaskComplete,
};
