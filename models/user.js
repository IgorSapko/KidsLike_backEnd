const {
	model,
	Schema,
	Types: { ObjectId },
} = require('mongoose');

const userSchema = new Schema({
	username: String,
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: value => value.includes('@'),
			message: 'Email must contain "@"',
		},
	},
	password: String,
	balance: Number,
	token: { type: String, required: false },
	currentWeek: { type: ObjectId, ref: 'Week' },
});

module.exports = model('User', userSchema);
