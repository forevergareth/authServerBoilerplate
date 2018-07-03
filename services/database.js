const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
  .connect(`${process.env.DATABASE_URI}`)
  .then(() => {
    console.log("MongoDB Connected Succesfully");
  })
  .catch(e => {
    console.log("MongoDB Failed to Connect");
  });
require("../models/User");
