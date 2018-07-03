const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const mongoose = require("mongoose");

const User = mongoose.model("Users");

const jwtoptions = {};
jwtoptions.jwtFromRequest = new ExtractJWT.fromAuthHeaderAsBearerToken();
jwtoptions.secretOrKey = `${process.env.SECRET_KEY}`;

module.exports = new JWTStrategy(jwtoptions, (payload, done) => {
  User.findById(payload.id)
    .then(user => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch(e => {
      done(e);
    });
});
