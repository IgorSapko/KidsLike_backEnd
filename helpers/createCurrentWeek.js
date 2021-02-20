//Packages
const dayjs = require('dayjs');
//Models
const taskModel = require('../models/task');
const weekModel = require('../models/week');
//Utils
const createDaysOfWeek = require('../utils/createDaysOfWeek');
//Data
const initialTasks = require('../data/initialTasks');

async function createCurrentWeek() {
	let tasksForWeek = [];
	const defaultTasks = [...initialTasks];

	const startWeek = dayjs().startOf('week').add(1, 'day');
	const daysOfWeek = createDaysOfWeek();

	for (let i = 0; i < defaultTasks.length; i++) {
		const taskForWeek = await taskModel.create({
			title: defaultTasks[i].title,
			reward: defaultTasks[i].reward,
			imageUrl: defaultTasks[i].imageUrl,
			days: daysOfWeek,
		});

		tasksForWeek.push(taskForWeek);
	}

	const currentWeek = await weekModel.create({
		startWeekDate: startWeek.format('DD-MM-YYYY'),
		endWeekDate: startWeek.add(6, 'day').format('DD-MM-YYYY'),
		rewardsGained: 0,
		rewardsPlanned: 0,
		tasks: tasksForWeek,
	});

	return currentWeek;
}

module.exports = createCurrentWeek;
