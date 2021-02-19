const {
	model,
	Schema,
	Types: { ObjectId },
} = require('mongoose');

const weekSchema = new Schema({
	startWeekDate: String,
	endWeekDate: String,
	rewardsGained: Number,
	rewardsPlanned: Number,
	tasks: [{ type: ObjectId, ref: 'Task' }],
});

module.exports = model('Week', weekSchema);
