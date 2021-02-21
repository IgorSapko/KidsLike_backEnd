const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
	fullName: String,
	position: String,
	avatar: String,
	socialLinks: [{ label: String, link: String }],
});

module.exports = model('Contact', contactSchema);
