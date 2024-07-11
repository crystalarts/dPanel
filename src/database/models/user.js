const mongoose = require("mongoose");

function generateRandomNumber() {
  const min = 1000000;
  const max = 543789215621;

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber.toString();
}

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: generateRandomNumber(),
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rank: {
    type: Array,
    default: {
      user: true,
      early_supporter: true,
      icrux: false,
      bug_hunter: false,
      staff: false,
      manager: false,
      management: false,
    },
  },
  weather: {
    type: Array,
    default: [{
      city: [
        "Warsaw"
      ]
    }]
  },
  plan: {
    type: String,
    default: "iCrux Free",
  },
  storageUsed: {
    type: Number,
    default: 0,
  },
  storageLimit: {
    type: Number,
    default: 5 * 1024 * 1024 * 1024,
  },
  server: {
    type: Number,
    required: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
