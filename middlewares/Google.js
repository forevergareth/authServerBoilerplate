const passport = require("passport");
exports._googleReturn = passport.authenticate("google", {
  failureRedirect: "/auth/google"
});

exports._googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"]
});
