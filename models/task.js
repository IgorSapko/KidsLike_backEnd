// Core Mongoose
const { model, Schema } = require('mongoose');

const taskSchema = new Schema({
	title: { type: String, required: true },
	reward: { type: Number, required: true },
	imageUrl: { type: String, required: false },
	days: [{ date: String, isActive: Boolean, isCompleted: Boolean }],
});

module.exports = model('Task', taskSchema);
