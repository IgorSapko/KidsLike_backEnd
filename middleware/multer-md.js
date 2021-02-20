//Middleware
const multer = require('multer');

//Declare storage
const multerMd = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: fileFilter,
});

//Filter files mimetype
function fileFilter(req, file, cb) {
	const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
}

module.exports = multerMd;
