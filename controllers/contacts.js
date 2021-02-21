//Models
const contactModel = require('../models/contact');

async function getTeamContacts(req, res, next) {
	const contacts = await contactModel.find({});

	return res.status(200).json(contacts);
}

module.exports = { getTeamContacts };
