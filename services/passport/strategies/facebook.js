const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("Users");

const transformFacebookProfile = profile => ({
  facebookId: profile.id,
  name: profile.name,
  email: profile.email || undefined,
  avatar: profile.picture.data.url
});

module.exports = new FacebookStrategy(
  {
    clientID: `${process.env.FACEBOOK_APP_ID}`,
    clientSecret: `${process.env.FACEBOOK_APP_SECRET}`,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["id", "picture", "displayName", "emails"],
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    let pro = transformFacebookProfile(profile._json);
    const userMatchIdAndEmail = await User.findOne({
      facebookId: pro.facebookId
    })
      .where("email")
      .equals(pro.email)
      .exec();
    if (userMatchIdAndEmail) {
      console.log("completeing with user match id and email");
      return done(null, userMatchIdAndEmail);
    }

    if (!userMatchIdAndEmail && pro.email) {
      const userMatchEmail = await User.findOne({ email: pro.email }).exec();
      if (userMatchEmail) {
        const updateUserWithFacebookId = await User.findOneAndUpdate(
          { email: pro.email },
          { $set: { facebookId: pro.facebookId } },
          { new: true }
        ).exec();
        console.log("completeing with updated user match email");
        console.log(updateUserWithFacebookId);
        return done(null, updateUserWithFacebookId);
      } else {
        console.log("Creating new user since none available");
        newUser = new User({
          facebookId: pro.facebookId,
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
