//Models
const teamModel = require('../models/team');

async function getTeamContacts(req, res, next) {
	const contacts = await teamModel.find({});

	return res.status(200).json(contacts);
}

module.exports = { getTeamContacts };
