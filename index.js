// Core Express & Mongoose
const express = require('express');
const mongoose = require('mongoose');
//Routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
const teamRouter = require('./routes/team');
//Middleware
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
//Handle logs
const accessLogStream = require('./utils/accessLogStream');
//Docs
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//Configs
const PORT = process.env.PORT || 8080;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_URL = `mongodb+srv://Admin:${MONGO_PASS}@cluster0.elolo.mongodb.net/kidsLike`;

start();

async function start() {
	const app = initServer();
	initMiddleware(app);
	declareRoutes(app);
	await connectToDb();
	listen(app);
}

function initServer() {
	return express();
}

function initMiddleware(app) {
	app.use(helmet());
	app.use(express.json());
	app.use(morgan('combined', { stream: accessLogStream }));
	app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
}

function declareRoutes(app) {
	app.use('/api/auth', authRouter);
	app.use('/api/user', userRouter);
	app.use('/api/task', taskRouter);
	app.use('/api/team', teamRouter);
	app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

async function connectToDb() {
	try {
		await mongoose.connect(MONGO_URL, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});

		console.log('Database connection successful');
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

function listen(app) {
	app.listen(PORT, () => console.log('Server is listening on port: ', PORT));
}
