//Core
const { format } = require('util');
const crypto = require('crypto');
//Middleware
const multer = require('multer');
//Packages
const gcloud = require('../gcloud-config/index');

const bucket = gcloud.bucket('kidslikev2_bucket');

//Declare storage
const multerMd = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: fileFilter,
});

//Filter files mimetype
function fileFilter(req, file, cb) {
	const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'];

	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
}

function uploadTaskAvatar(file) {
	if (file) {
		return new Promise((resolve, reject) => {
			const { originalname, buffer } = file;

			const fileName = crypto.randomBytes(16).toString('hex');
			const blob = bucket.file(originalname.replace(/.*(?=\.)/, fileName));
			const blobStream = blob.createWriteStream({ resumable: false });

			blobStream
				.on('finish', () => {
					const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
					resolve(publicUrl);
				})
				.on('error', err => reject(err))
				.end(buffer);
		});
	}

	return null;
}

module.exports = { multerMd, uploadTaskAvatar };
