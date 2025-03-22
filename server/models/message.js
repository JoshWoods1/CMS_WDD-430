const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  id: { type: String, required: true },
  subject: { type: String },
  msgText: { type: String, required: true },
  //This may have to be id later on but not sure
  sender: { type: String, required: true },
});

module.exports = mongoose.model("Message", messageSchema);
