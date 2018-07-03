//const mongoose = require("mongoose");
//const User = mongoose.model("Users");

exports._handleGetCurrentUser = (req, res) => {
  res.send(req.user);
};
