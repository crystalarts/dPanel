const mongoose = require("mongoose");
const url = require("../config/database.json").MONGODB_URL;

mongoose.set("strictQuery", false);

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) =>
    error
      ? console.log("[DATABASE] : FAILED : Not connected to the database.")
      : console.log("[DATABASE] : SUCCESS : Connected to the database."),
);
