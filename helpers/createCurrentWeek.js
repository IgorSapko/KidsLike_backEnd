//Packages
const { DateTime } = require('luxon');
//Models
const taskModel = require('../models/task');
const weekModel = require('../models/week');
//Utils
const createDaysOfWeek = require('./createDaysOfWeek');
//Data
const initialTasks = require('../data/initialTasks');

/**
 * This function returns the current week with start and end date.
 * It also returns all default tasks for the current week.
 */
async function createCurrentWeek() {
	let tasksForWeek = [];
	const defaultTasks = [...initialTasks];

	const startWeek = DateTime.local().startOf('week');
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
		startWeekDate: startWeek.toFormat('dd-MM-yyyy'),
		endWeekDate: startWeek.plus({ days: 6 }).toFormat('dd-MM-yyyy'),
		pointsGained: 0,
		pointsPlanned: 0,
		tasks: tasksForWeek,
	});

	return currentWeek;
}

module.exports = createCurrentWeek;
