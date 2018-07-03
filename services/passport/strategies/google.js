const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("Users");

// Transform Google profile into user object
const transformGoogleProfile = profile => ({
  googleId: profile.id,
  name: profile.displayName,
  email: profile.emails[0].value,
  avatar: profile.image.url
});

module.exports = new GoogleStrategy(
  {
    clientID: `${process.env.GOOGLE_CLIENT_ID}` || "string",
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}` || "string",
    callbackURL: "/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    let pro = transformGoogleProfile(profile._json);
    const userMatchIdAndEmail = await User.findOne({
      googleId: pro.googleId
    })
      .where("email")
      .equals(pro.email)
      .exec();
    if (userMatchIdAndEmail) {
      console.log("Completeing with user match id and email");
      return done(null, userMatchIdAndEmail);
    }

    if (!userMatchIdAndEmail && pro.email) {
      const userMatchEmail = await User.findOne({ email: pro.email }).exec();
      if (userMatchEmail) {
        const updateUserWithGoogleId = await User.findOneAndUpdate(
          { email: pro.email },
          { $set: { googleId: pro.googleId } },
          { new: true }
        ).exec();
        console.log("Completeing with updated user match email");
        console.log(updateUserWithGoogleId);
        return done(null, updateUserWithGoogleId);
      } else {
        console.log("Creating new user since none available");
        newUser = new User({
          googleId: pro.googleId,
          name: pro.name,
          email: pro.email
          //avatar: userProfile.avatar
        });
        const finalUser = await newUser.save();
        return done(null, finalUser);
      }
    }
    console.log("Something went wrong");
    return done(null, false);
  }
);
