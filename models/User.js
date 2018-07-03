const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: false,
    default: "test"
  }
});

UserSchema.pre("save", function(next) {
  const user = this;
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(testPassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(testPassword, user.password).then(match => {
      if (match) resolve(match);
      reject("Failed");
    });
  });
};
mongoose.model("Users", UserSchema);
