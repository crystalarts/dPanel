const mongoose = require("mongoose");

const ServerSchema = new mongoose.Schema({
  serverNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  userCount: {
    type: Number,
    default: 0,
  },
  userLimit: {
    type: Number,
    default: 100,
  },
  storageUsed: {
    type: Number,
    default: 0,
  },
  storageLimit: {
    type: Number,
    default: 500 * 1024 * 1024 * 1024,
  },
});

const Server = mongoose.model("Server", ServerSchema);
module.exports = Server;
