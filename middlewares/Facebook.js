const passport = require("passport");
exports._facebookReturn = passport.authenticate("facebook", {
  failureRedirect: "/auth/facebook"
});

exports._facebookAuth = passport.authenticate("facebook", { scope: ["email"] });
