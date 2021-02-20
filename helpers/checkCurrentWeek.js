//Packages
const dayjs = require('dayjs');
//Models
const weekModel = require('../models/week');

async function checkCurrentWeek(currentWeekId) {
	const startWeek = dayjs().startOf('week').add(1, 'day').format('DD-MM-YYYY');
	const userCurrentWeek = await weekModel.findOne({ _id: currentWeekId }).populate('tasks');

	return userCurrentWeek.startWeekDate === startWeek ? userCurrentWeek : false;
}

module.exports = checkCurrentWeek;
