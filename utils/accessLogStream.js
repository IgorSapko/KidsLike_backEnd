//Core
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../history/access.txt'), {
	flags: 'a',
});

module.exports = accessLogStream;
