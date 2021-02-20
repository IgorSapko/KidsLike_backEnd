//Models
const userModel = require('../models/user');
const weekModel = require('../models/week');
const taskModel = require('../models/task');
//Helpers
const checkCurrentWeek = require('../helpers/checkCurrentWeek');
const createCurrentWeek = require('../helpers/createCurrentWeek');

/**
 * This function receives authorized user and
 * returns the current user with the current week and tasks
 */
async function getCurrentUser(req, res) {
	const user = req.user;

	const currentWeek = await checkCurrentWeek(user.currentWeek);

	if (!currentWeek) {
		const newWeek = await createCurrentWeek();

		user.currentWeek = newWeek._id;
		await user.save();
	}

	const currentUser = await userModel.findOne({ _id: user._id }).populate({
		select: '-__v',
		model: weekModel,
		path: 'currentWeek',
		populate: [{ path: 'tasks', model: taskModel, select: '-__v' }],
	});

	const { email, balance, _id, username, currentWeek: week } = currentUser;
	const response = { user: { id: _id, username, email, balance }, week };

	return res.status(200).json(response);
}

module.exports = { getCurrentUser };
