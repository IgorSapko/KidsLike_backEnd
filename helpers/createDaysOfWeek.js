//Packages
const dayjs = require('dayjs');

/**
 * This function returns days of the current week.
 * Each day is an object with certain properties (date, isActive, isCompleted)
 */
function createDaysOfWeek() {
	const daysOfWeek = [];

	const startWeek = dayjs().startOf('week').add(1, 'day');

	for (let i = 0; i < 7; i++) {
		daysOfWeek.push({
			date: startWeek.add(i, 'day').format('DD-MM-YYYY'),
			isActive: false,
			isCompleted: false,
		});
	}

	return daysOfWeek;
}

module.exports = createDaysOfWeek;
