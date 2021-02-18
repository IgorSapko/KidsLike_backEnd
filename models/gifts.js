const mongoose = require("mongoose");
const { Schema } = mongoose;

const AwardSchema = new Schema({
  title: {
    type: String,
  },
  points: {
    type: String,
  },
  imageURL: {
    type: String,
  },
});

const Award = mongoose.model("Award", AwardSchema);

module.exports = Award;
