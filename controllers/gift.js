//Models
const giftModel = require('../models/gift');

/**
 * Gets a list of gifts from the database and returns them
 * */
async function getGifts(req, res) {
	const gifts = await giftModel.find({});

	return res.status(200).json(gifts);
}

/**
 * Gets a list of gift IDs, searches for them among all gifts
 * and if there are enough points, then returns the ID
 * of the selected gifts and the user's updated balance.
 * */
async function chooseGifts(req, res) {
	const {
		body: { giftIDs },
		user,
	} = req;

	let totalPrice = 0;

	const gifts = await giftModel.find({});

	const orderedGifts = giftIDs.reduce((acc, giftId) => {
		const gift = gifts.find(({ _id }) => _id.toString() === giftId);

		if (!gift) {
			return res.status(404).json({ message: 'Gift not found' });
		}

		totalPrice += gift.price;
		acc.push(gift._id);

		return acc;
	}, []);

	if (user.balance < totalPrice) {
		return res.status(409).json({ message: 'Not enough points' });
	}

	user.balance -= totalPrice;
	await user.save();

	return res.status(200).json({ updatedBalance: user.balance, orderedGifts });
}

module.exports = { getGifts, chooseGifts };
