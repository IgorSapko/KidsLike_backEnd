//Core
const { URL } = require('url');
//Packages
const axios = require('axios');
const queryString = require('query-string');
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
	const {
		body: { password, email },
		headers: { origin },
	} = req;

	const existingUser = await userModel.findOne({ email });

	if (existingUser) {
		return res.status(409).json({ message: 'User with such email already exists' });
	}

	const encryptedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));
	const week = await createCurrentWeek();

	const createdUser = await userModel.create({
		email,
		password: encryptedPassword,
		balance: 0,
		currentWeek: week._id,
		origin,
	});

	const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
	});

	await userModel.findByIdAndUpdate(createdUser._id, { token }, { new: true });

	const currentUser = await userModel.findOne({ email }).populate({
		select: '-__v',
		model: weekModel,
		path: 'currentWeek',
		populate: [{ path: 'tasks', model: taskModel, select: '-__v' }],
	});

	const { _id, email: _email, balance, currentWeek } = currentUser;

	return res
		.status(201)
		.json({ token, user: { id: _id, email: _email, balance }, week: currentWeek });
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

	return res.status(200).json({ token, user: { id: _id, email, balance }, week: currentWeek });
}

/**
 * Gets the user._id from the request and resets the user token.
 * Returns status 204
 * */
async function signOutUser(req, res) {
	await userModel.findByIdAndUpdate(req.user._id, { token: '' });

	return res.status(204).send();
}

async function authGoogle(req, res) {
	const gProfile = 'https://www.googleapis.com/auth/userinfo.profile';
	const gEmail = 'https://www.googleapis.com/auth/userinfo.email';

	const queryParams = queryString.stringify({
		redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
		client_id: process.env.GOOGLE_CLIENT_ID,
		scope: [gEmail, gProfile].join(' '),
		access_type: 'offline',
		response_type: 'code',
		prompt: 'consent',
	});

	return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`);
}

async function redirectGoogle(req, res) {
	const { protocol, originalUrl } = req;

	const fullUrl = `${protocol}://${req.get('host')}${originalUrl}`;
	const urlObject = new URL(fullUrl);
	const urlParams = queryString.parse(urlObject.search);
	const urlCode = urlParams.code;

	const gToken = await axios({
		method: 'post',
		url: `https://oauth2.googleapis.com/token`,
		data: {
			redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			client_id: process.env.GOOGLE_CLIENT_ID,
			grant_type: 'authorization_code',
			code: urlCode,
		},
	});

	const gUser = await axios({
		method: 'get',
		url: 'https://www.googleapis.com/oauth2/v2/userinfo',
		headers: { Authorization: `Bearer ${gToken.data.access_token}` },
	});

	const existingUser = await userModel.findOne({ email: gUser.data.email });

	if (!existingUser || !existingUser.origin) {
		return res
			.status(403)
			.json({ message: 'You should register first. Google auth is only for sign-in' });
	}

	const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
	});

	await userModel.findByIdAndUpdate(existingUser._id, { $set: { token } }, { new: true });

	return res.redirect(`${existingUser.origin}?token=${token}`);
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
	authGoogle,
	redirectGoogle,
	validateToken,
};
