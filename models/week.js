// Core Mongoose
const {
	model,
	Schema,
	Types: { ObjectId },
} = require('mongoose');

const weekSchema = new Schema({
	startWeekDate: { type: String },
	endWeekDate: { type: String },
	pointsGained: { type: Number },
	pointsPlanned: { type: Number },
	tasks: [{ type: ObjectId, ref: 'Task' }],
});

module.exports = model('Week', weekSchema);
