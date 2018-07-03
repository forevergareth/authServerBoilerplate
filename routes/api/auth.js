const AuthController = require("../../controllers/authController");
const Facebook = require("../../middlewares/Facebook");
const Google = require("../../middlewares/Google");
const blockIfAuth = require("../../middlewares/isAuth");

module.exports = apiRouter => {
  /////////////////////////////////
  // AUTH ROUTES
  // FACEBOOK
  apiRouter.route("/auth/facebook").get(Facebook._facebookAuth);
  apiRouter
    .route("/auth/facebook/callback")
    .get(Facebook._facebookReturn, AuthController._handleFacebookCallback);

  ////////////////////////////////
  // GOOGLE
  apiRouter.route("/auth/google").get(Google._googleAuth);
  apiRouter
    .route("/auth/google/callback")
    .get(Google._googleReturn, AuthController._handleGoogleCallback);

  ////////////////////////////////
  // LOCAL
  apiRouter
    .route("/auth/signup")
    .put(blockIfAuth, AuthController._handleSignup);

  apiRouter
    .route("/auth/signin")
    .post(blockIfAuth, AuthController._handleSignin);

  apiRouter.route("/auth/signout").get(AuthController._handleSignout);
};
