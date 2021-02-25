module.exports = {
	users: {
		userPassMin: 6,
		userPassMax: 20,
	},

	tasks: {
		rewardPointMin: 1,
		dateRegex: /^\s*(3[01]|[12][0-9]|0?[1-9])\-(1[012]|0?[1-9])\-((?:19|20)\d{2})\s*$/,
		tasksDayMin: 7,
		tasksDayMax: 7,
	},

	gifts: {
		gistCountMin: 1,
		gistCountMax: 8,
	},
};
