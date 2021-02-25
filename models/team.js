const { Schema, model } = require('mongoose');

const teamSchema = new Schema({
	fullName: String,
	position: String,
	avatar: String,
	socialLinks: [{ label: String, link: String }],
});

module.exports = model('Team', teamSchema);
