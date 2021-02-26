const { PresentsModel } = require('./models/gift');
const { ChildrenModel } = require('./models/children');
const { uploadImage } = require('../middleware/multer-md');
const Joi = require('joi');

class PresentsController {
	async getAllPresentsChild(req, res) {
		try {
			const session = req.session;
			if (!session) {
				return res.status(404).send({ message: 'Session was not found' });
			}

			const userId = req.user.id;

			const allChildrenByUser = await ChildrenModel.find({
				idUser: userId,
			});

			if (!allChildrenByUser) {
				return res.status(401).send({ message: 'Not found User ID' });
			}
			// собираем все idPresent со всех детей в массив
			const allPresents = allChildrenByUser.reduce((acc, present) => {
				present.presents.length > 0 ? acc.push(...present.presents) : false;
				return acc;
			}, []);
			//находим всех pressent по id
			const x = await PresentsModel.find({ _id: { $in: allPresents } });

			return res.status(201).send(x);
		} catch (error) {
			console.log(error);
		}
	}
	async addPresent(req, res, next) {
		try {
			const session = req.session;
			if (!session) {
				return res.status(404).send({ message: 'Session was not found' });
			}
			const { childId, title, reward } = req.body;

			const presentImg = req.file;

			const imageURL = await uploadImage(presentImg);

			const imagePath = imageURL ? imageURL : '';

			const newPresent = await PresentsModel.create({
				title,
				childId,
				reward,
				image: imagePath,
				dateCreated: Date.now(),
			});
			await ChildrenModel.findById(childId, (err, child) => {
				if (err) {
					return res.status(404).send({ message: 'Not Found Child' });
				}
				child.presents.push(newPresent._id);
				child.save();
				res.status(201).send(newPresent);
			});
		} catch (err) {
			next(err);
		}
	}

	async removePresent(req, res, next) {
		try {
			const session = req.session;
			if (!session) {
				return res.status(404).send({ message: 'Session was not found' });
			}
			const { presentId } = req.params;

			const present = await PresentsModel.findById(presentId);
			if (!present) {
				return res.status(404).send({ message: 'Present was not found' });
			}

			const childToUpdate = await ChildrenModel.findByIdAndUpdate(
				present.childId,
				{ $pull: { presents: presentId } },
				{ new: true },
			);
			if (!childToUpdate) {
				return res.status(404).send({ message: 'Child was not found' });
			}

			await PresentsModel.findByIdAndDelete(presentId);

			return res.status(200).send({ message: 'Present was deleted successful' });
		} catch (err) {
			next(err);
		}
	}

	async updatePresent(req, res, next) {
		try {
			!req.session && res.status(404).send({ message: 'Session was not found' });

			const { presentId } = req.params;

			const presentImg = req.file;

			const imageURL = await uploadImage(presentImg);
			imageURL ? (req.body.image = imageURL) : null;

			const updatedPresent = await PresentsModel.findByIdAndUpdate(
				presentId,
				{
					...req.body,
					dateCreated: Date.now(),
				},
				{ new: true },
			);

			return updatedPresent
				? res.status(200).send(updatedPresent)
				: res.status(404).send({ message: 'Present was not found' });
		} catch (error) {
			next(error);
		}
	}

	async buyPresent(req, res, next) {
		try {
			const session = req.session;
			if (!session) {
				return res.status(404).send({ message: 'Session was not found' });
			}
			const { presentId } = req.params;

			const present = await PresentsModel.findById(presentId);
			const child = await ChildrenModel.findById(present.childId);

			const rewardChild = child.stars;
			const rewardPresent = present.reward;

			if (rewardChild >= rewardPresent) {
				const newRewardPresent = rewardChild - rewardPresent;
				await ChildrenModel.findByIdAndUpdate(
					present.childId,
					{ stars: newRewardPresent },
					{ new: true },
				);
				const childToUpdate = await ChildrenModel.findByIdAndUpdate(
					present.childId,
					{ $pull: { presents: presentId } },
					{ new: true },
				);
				if (!childToUpdate) {
					return res.status(404).send({ message: 'Child was not found' });
				}
				await PresentsModel.findByIdAndDelete(presentId);
				return res.status(200).send({ message: 'Present was bought' });
			} else {
				res.status(404).send({ message: "You don't have that much stars" });
			}
		} catch (err) {
			next(err);
		}
	}

	addPresentValidation(req, res, next) {
		const addSchemaValidator = Joi.object({
			_id: Joi.string(),
			title: Joi.string(),
			childId: Joi.string().required(),
			reward: Joi.number(),
			image: Joi.string(),
			dateCreated: Joi.date(),
		});

		PresentsController.checkValidationError(addSchemaValidator, req, res, next);
	}

	updatePresentValidation(req, res, next) {
		const updateSchemaRules = Joi.object({
			title: Joi.string(),
			childId: Joi.string(),
			reward: Joi.number(),
			image: Joi.string(),
		});

		PresentsController.checkValidationError(updateSchemaRules, req, res, next);
	}

	static checkValidationError(schema, req, res, next) {
		const { error } = schema.validate(req.body);

		if (error) {
			const { message } = error.details[0];
			return res.status(400).send({ error: message });
		}
		next();
	}
}

module.exports = new PresentsController();
