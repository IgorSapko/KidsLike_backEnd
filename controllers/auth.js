//Models
const userModel = require('../models/user');
const weekModel = require('../models/week');
const taskModel = require('../models/task');
//Crypt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Helpers
const createCurrentWeek = require('../helpers/createCurrentWeek');

/**
 * Gets user credential from the request, checks email, create password hash,
 * create a new user and return it
 * */
async function signUpUser(req, res) {
	const { password } = req.body;

	const existingUser = await userModel.findOne({ email: req.body.email });

	if (existingUser) {
		return res.status(409).json({ message: 'User with such email already exists' });
	}

	const encryptedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));
	const week = await createCurrentWeek();
	const newUser = { ...req.body, password: encryptedPassword, balance: 0, currentWeek: week._id };

	const createdUser = await userModel.create(newUser);

	const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
	});

	const currentUser = await userModel.findOne({ email: req.body.email }).populate({
		select: '-__v',
		model: weekModel,
		path: 'currentWeek',
		populate: [{ path: 'tasks', model: taskModel, select: '-__v' }],
	});

	const { _id, username, email, balance, currentWeek } = currentUser;

	return res.status(201).json({
		token,
		user: { id: _id, username, email, balance },
		week: currentWeek,
	});
}

/**
 * Gets user credential from the request, checks it, creates token,
 * and return the user with the token.
 * */
async function signInUser(req, res) {
	const user = await userModel.findOne({ email: req.body.email });

	if (!user) {
		return res.status(404).json({ message: 'User with such email not found' });
	}

	const isUserPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

	if (!isUserPasswordCorrect) {
		return res.status(403).json({ message: 'Email does not exist or password is wrong' });
	}

	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
	});

	await userModel.findByIdAndUpdate(user._id, { token }, { new: true });

	const currentUser = await userModel.findOne({ email: req.body.email }).populate({
		select: '-__v',
		model: weekModel,
		path: 'currentWeek',
		populate: [{ path: 'tasks', model: taskModel, select: '-__v' }],
	});

	const { _id, email, balance, currentWeek } = currentUser;

	return res.status(200).json({
		token,
		user: { id: _id, email, balance },
		week: currentWeek,
	});
}

/**
 * Gets the user._id from the request and resets the user token.
 * Returns status 204
 * */
async function signOutUser(req, res) {
	await userModel.findByIdAndUpdate(req.user._id, { token: '' });

	return res.status(204).send();
}

//Validate user token
async function validateToken(req, res, next) {
	try {
		const authorizationHeader = req.get('Authorization') || '';
		const token = authorizationHeader.replace('Bearer ', '');

		try {
			const userId = await jwt.verify(token, process.env.JWT_SECRET_KEY).userId;
			const user = await userModel.findById(userId);

			if (!user) {
				return res.status(404).json({ message: 'Invalid user' });
			}

			if (user.token !== token) {
				return res.status(401).json({ message: 'Bearer auth failed' });
			}

			req.user = user;

			next();
		} catch (err) {
			return res.status(400).json({ message: 'No token provided' });
		}
	} catch (err) {
		next(err);
	}
}

module.exports = {
	signUpUser,
	signInUser,
	signOutUser,
	validateToken,
};
