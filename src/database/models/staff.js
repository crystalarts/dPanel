const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  id: {
    type: String,
    default: "",
  },
  points: {
    type: String,
    default: "0",
  },
  limitPoints: {
    type: String,
    default: "10",
  },
  uptime: {
    type: Number,
    default: 0,
  },
  uptimeOffline: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "offline",
  },
  lastSeen: { 
    type: Date, 
    default: Date.now 
  },
  message: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Staff = mongoose.model("Staff", StaffSchema);

module.exports = Staff;
