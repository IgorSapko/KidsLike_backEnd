//Core Express
const { Router } = require('express');
//Controllers
const { getTeamContacts } = require('../controllers/contacts');
//Helpers
const tryCatchHandler = require('../helpers/tryCatchHandler');

const contactRouter = Router();

// @ GET /api/contacts
contactRouter.get('/', tryCatchHandler(getTeamContacts));

module.exports = contactRouter;
