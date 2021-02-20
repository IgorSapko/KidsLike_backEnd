const { model, Schema } = require('mongoose');

const taskSchema = new Schema({
	title: String,
	reward: Number,
	imageUrl: String,
	days: [{ date: String, isActive: Boolean, isCompleted: Boolean }],
});

module.exports = model('Task', taskSchema);
