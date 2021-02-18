const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => value.includes("@"),
      message: 'Email must contain "@"',
    },
  },
  password: { type: String, required: true },
  userName: {
    type: String,
    required: true,
  },
  planningTasks: [
    {
      title: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      imageURL: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      }, 
    },
  ],
  doneTasks: [
    {
      title: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      imageURL: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      }, 
    },
  ],
  points: Number,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
