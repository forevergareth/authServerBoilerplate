const passport = require("passport");
// const googleStrategy = require("./strategies/google");
// const facebookStrategy = require("./strategies/facebook");
const jwtStrategy = require("./strategies/jwt");
const localStrategy = require("./strategies/local");

const mongoose = require("mongoose");
const User = mongoose.model("Users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

//passport.use(googleStrategy);
//passport.use(facebookStrategy);
passport.use(jwtStrategy);
passport.use(localStrategy);
