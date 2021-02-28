//Packages
const { DateTime } = require('luxon');

/**
 * This function returns days of the current week.
 * Each day is an object with certain properties (date, isActive, isCompleted)
 */
function createDaysOfWeek() {
	const daysOfWeek = [];

	const startWeek = DateTime.local().startOf('week');

	for (let i = 0; i < 7; i += 1) {
		daysOfWeek.push({
			date: startWeek.plus({ days: i }).toFormat('dd-MM-yyyy'),
			isActive: false,
			isCompleted: false,
		});
	}

	return daysOfWeek;
}

module.exports = createDaysOfWeek;
