const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactSchema = new Schema({
  nameSurname: {
    type: String,
  },

  position: {
    type: String,
  },

  description: {
    type: String,
  },
});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
