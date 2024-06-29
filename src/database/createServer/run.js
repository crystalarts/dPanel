// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const mongoose = require('mongoose');
const Server = require('../models/server');
const url = require("../../config/database.json").MONGODB_URL;

const db = url;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    for (let i = 1; i <= 4; i++) {
      const existingServer = await Server.findOne({ serverNumber: i });
      if (!existingServer) {
        const newServer = new Server({ serverNumber: i });
        await newServer.save();
        console.log(`Server ${i} initialized`);
      }
    }
    mongoose.disconnect();
  })
  .catch(err => console.log(err));