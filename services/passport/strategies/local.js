const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("Users");

const localOptions = {
  usernamefield: "email",
  session: false
};

module.exports = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        user.comparePassword(password).then(match => {
          if (match) {
            return done(null, user);
          }
          return done({ error: "Password Incorrect" });
        });
      } else {
        return done(null, false);
      }
    })
    .catch(e => {
      done(e);
    });
});
