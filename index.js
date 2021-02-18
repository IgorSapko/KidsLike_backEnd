const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const contactRouter = require("./routes/contact.routes");
const {  userRouter } = require("./routes/user.routes");
const {  giftRouter } = require("./routes/gift.routes");
const {  taskRouter } = require("./routes/tasks.routes");

require("dotenv").config();

const MONGO_PASS = process.env.MONGO_PASS;
const PORT = process.env.PORT;
const MONGO_URL = `mongodb+srv://Admin:${MONGO_PASS}@cluster0.elolo.mongodb.net/kidsLike`;

start();

async function start() {
  const app = initServer();
  initMiddlewares(app);
  declareRoutes(app);
  await connectToDb();
  listen(app);
}

function initServer() {
  return express();
}

function initMiddlewares(app) {
  app.use(cors());
  app.use(express.json());
}

function declareRoutes(app) {
  // app.use("/api/contacts", contactRouter);
  // app.use("/auth", userRouterAuth);
  // app.use("/users", userRouter);
}

async function connectToDb() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

function listen(app) {
  app.listen(PORT, () => {
    console.log("Server is listening on port: ", PORT);
  });
}

