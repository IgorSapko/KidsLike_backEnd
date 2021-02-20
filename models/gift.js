const { model, Schema } = require('mongoose');

const giftSchema = new Schema({
	title: String,
	price: Number,
	imageURL: String,
	isSelected: Boolean,
});

module.exports = model('Gift', giftSchema);
