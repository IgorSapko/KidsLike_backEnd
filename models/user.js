// Core Mongoose
const {
	model,
	Schema,
	Types: { ObjectId },
} = require('mongoose');

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: value => value.includes('@'),
			message: 'Email must contain "@"',
		},
	},
	password: { type: String, required: true },
	balance: { type: Number, required: false },
	token: { type: String, required: false },
	currentWeek: { type: ObjectId, ref: 'Week' },
});

module.exports = model('User', userSchema);
