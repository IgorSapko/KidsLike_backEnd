const { Router } = require('express');
const presentsController = require('./controllers/gift');
const LoginController = require('./controllers/auth');
const { multerMid } = require('../middleware/multer-md');
const router = Router();

router.post(
	'/',
	LoginController.authorize,
	multerMid.single('file'),
	presentsController.addPresentValidation,
	presentsController.addPresent,
);
router.patch('/buy/:presentId', LoginController.authorize, presentsController.buyPresent);
router.delete('/:presentId', LoginController.authorize, presentsController.removePresent);
router.patch(
	'/:presentId',
	LoginController.authorize,
	multerMid.single('file'),
	presentsController.updatePresentValidation,
	presentsController.updatePresent,
);
router.get('/', LoginController.authorize, presentsController.getAllPresentsChild);

module.exports = router;
