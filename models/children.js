const {
	Schema,
	model,
	Types: { ObjectId },
} = require('mongoose');

const { HabbitsSchema } = require('./models/habbits');

const ChildrenSchema = new Schema({
	idUser: { type: String, required: true },
	name: { type: String },
	gender: {
		type: String,
		required: true,
		enum: ['male', 'female'],
	},
	stars: { type: Number, default: 0 },
	habbits: [HabbitsSchema],
	tasks: [{ type: ObjectId, ref: 'Tasks' }],
	presents: [{ type: ObjectId, ref: 'Presents' }],
});

exports.ChildrenModel = model('Children', ChildrenSchema);
