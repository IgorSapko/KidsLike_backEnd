//Core Express
const { Router } = require('express');
//Controllers
const { getTeamContacts } = require('../controllers/team');
//Helpers
const tryCatchHandler = require('../helpers/tryCatchHandler');

const teamRouter = Router();

// @ GET /api/team/contacts
teamRouter.get('/contacts', tryCatchHandler(getTeamContacts));

module.exports = teamRouter;
