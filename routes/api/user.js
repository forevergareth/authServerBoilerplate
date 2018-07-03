const UserController = require("../../controllers/userController");
const requireAuth = require("../../middlewares/requireAuth");

module.exports = apiRouter => {
  apiRouter
    .route("/current_user")
    .get(requireAuth, UserController._handleGetCurrentUser);
};
