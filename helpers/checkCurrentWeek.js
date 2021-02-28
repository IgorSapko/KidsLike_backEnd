//Packages
const { DateTime } = require('luxon');
//Models
const weekModel = require('../models/week');

/**
 * This function checks the current week.
 * If the current week is over, then it returns false.
 * If the current week isn't over, it returns the current week.
 */
async function checkCurrentWeek(currentWeekId) {
	const startWeek = DateTime.local().startOf('week').toFormat('dd-MM-yyyy');
	const userCurrentWeek = await weekModel.findOne({ _id: currentWeekId }).populate('tasks');

	return userCurrentWeek.startWeekDate === startWeek ? userCurrentWeek : false;
}

module.exports = checkCurrentWeek;
