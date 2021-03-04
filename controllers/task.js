//Models
const userModel = require('../models/user');
const weekModel = require('../models/week');
const taskModel = require('../models/task');
//Middleware
const { uploadTaskAvatar } = require('../middleware/multer-md');
//Utils
const createDaysOfWeek = require('../helpers/createDaysOfWeek');

const DEFAULT_URL =
	'https://storage.googleapis.com/kidslikev2_bucket/32c0d07a2fb62667895a261b612ad71c.png';

async function createCustomTask(req, res) {
	const {
		body: { title, reward },
		user,
		file,
	} = req;

	let imageUrl;

	!file ? (imageUrl = DEFAULT_URL) : (imageUrl = await uploadTaskAvatar(file));

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

async function switchTaskActive(req, res) {
	const {
		params: { taskId },
		body: { days },
		user,
	} = req;

	const task = await taskModel.findById(taskId);

	const currentUser = await userModel.findById({ _id: user._id }).populate({
		select: '-__v',
		model: weekModel,
		path: 'currentWeek',
		populate: [{ path: 'tasks', model: taskModel, select: '-__v' }],
	});

	const userTask = currentUser.currentWeek.tasks.find(({ _id }) => _id.toString() === taskId);

	if (!task || !userTask) {
		return res.status(404).json({ message: 'Task not found' });
	}

	const week = await weekModel.findById(currentUser.currentWeek._id);

	for (let i = 0; i < 7; i += 1) {
		if (task.days[i].isActive && !days[i]) {
			week.pointsPlanned -= task.reward;
		}

		if (!task.days[i].isActive && days[i]) {
			week.pointsPlanned += task.reward;
		}

		task.days[i].isActive = days[i];
	}

	await task.save();
	await week.save();

	const { title, reward, imageUrl, _id } = task;

	return res.status(200).json({
		updatedWeekPlannedPoints: week?.pointsPlanned,
		updatedTask: { title, reward, imageUrl, id: _id, days: task.days },
	});
}

async function switchTaskComplete(req, res) {
	const {
		params: { taskId },
		body: { date },
		user,
	} = req;

	const task = await taskModel.findById(taskId);

	const currentUser = await userModel.findById({ _id: user._id }).populate({
		select: '-__v',
		model: weekModel,
		path: 'currentWeek',
		populate: [{ path: 'tasks', model: taskModel, select: '-__v' }],
	});

	const userTask = currentUser.currentWeek.tasks.find(({ _id }) => _id.toString() === taskId);

	if (!task || !userTask) {
		return res.status(404).json({ message: 'Task not found' });
	}

	const dayForUpdate = task.days.find(day => day.date === date);

	if (!dayForUpdate) {
		return res.status(404).json({ message: 'Day not found' });
	}

	if (!dayForUpdate.isActive) {
		return res.status(400).json({ message: 'This task does not exist on such day' });
	}

	const week = await weekModel.findById(currentUser.currentWeek._id);

	if (!dayForUpdate.isCompleted) {
		user.balance += task.reward;
		week.pointsGained += task.reward;
	} else {
		user.balance -= task.reward;
		week.pointsGained -= task.reward;
	}

	dayForUpdate.isCompleted = !dayForUpdate.isCompleted;

	await task.save();
	await user.save();
	await week.save();

	const { title, reward, imageUrl, _id, days } = task;

	return res.status(200).json({
		updatedBalance: user.balance,
		updatedWeekGainedPoints: week.pointsGained,
		updatedTask: { id: _id, title, reward, imageUrl, days },
	});
}

module.exports = { createCustomTask, switchTaskActive, switchTaskComplete };
