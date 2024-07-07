const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema({
  id: {
    type: String,
    default: "595091014287611393"
  },
  register: {
    type: Number,
    default: 0
  },
  shop: {
    type: Number,
    default: 0
  },
  supportcenter: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Stats = mongoose.model("Stats", StatsSchema);

module.exports = Stats;
