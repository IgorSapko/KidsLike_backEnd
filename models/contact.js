const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
	fullName: String,
	position: String,
	description: String,
});

module.exports = model('Contact', contactSchema);
