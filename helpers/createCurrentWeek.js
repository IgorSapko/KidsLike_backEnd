//Packages
const dayjs = require('dayjs');
//Models
const taskModel = require('../models/task');
const weekModel = require('../models/week');
//Data
const initialTasks = require('../data/initialTasks');

async function createCurrentWeek() {
	let daysOfWeek = [];
	let tasksForWeek = [];
	const defaultTasks = [...initialTasks];

	const startWeek = dayjs().startOf('week').add(1, 'day');

	for (let i = 0; i < 7; i++) {
		daysOfWeek.push({
			date: startWeek.add(i, 'day').format('DD-MM-YYYY'),
			isActive: false,
			isCompleted: false,
		});
	}

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
