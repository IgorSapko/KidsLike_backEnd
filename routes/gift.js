//Core Express
const { Router } = require('express');
//Controllers
const { validateToken } = require('../controllers/auth');
const { getGifts, chooseGifts } = require('../controllers/gift');
//Helpers
const validate = require('../helpers/validate');
const tryCatchHandler = require('../helpers/tryCatchHandler');
const { chooseGiftSchema } = require('../helpers/validationSchemas');

const giftRouter = Router();

// @ GET /api/gift/
giftRouter.get('/', tryCatchHandler(validateToken), tryCatchHandler(getGifts));

// @ PATCH /api/gift/
giftRouter.patch(
	'/',
	tryCatchHandler(validateToken),
	validate(chooseGiftSchema),
	tryCatchHandler(chooseGifts),
);

module.exports = giftRouter;
