const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("Users");

const issueTokenAndRespond = (user, res) => {
  jwt.sign(
    user,
    `${process.env.SECRET_KEY}`,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) {
        return console.log(err);
      }
      res.json({ success: true, token: `Bearer ${token}` });
    }
  );
};
exports._handleFacebookCallback = (req, res) => {
  const payload = { id: req.user.id };
  issueTokenAndRespond(payload, res);
};
exports._handleGoogleCallback = (req, res) => {
  const payload = { id: req.user.id };
  issueTokenAndRespond(payload, res);
};

exports._handleSignup = (req, res) => {
  const { email, password, name } = req.body;

  //validate required inputs
  User.findOne({ email: email }).then(user => {
    if (user) return res.status(422).json({ error: "Account already exists" });

    const newUser = new User({ name, password, email });
    newUser
      .save()
      .then(user => {
        issueTokenAndRespond(user, res);
      })
      .catch(e => {
        console.log(e);
      });
  });
};

exports._handleSignin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }).then(user => {
    if (!user) return res.status(404).json({ error: "Account doesn't exists" });

    user
      .comparePassword(password)
      .then(match => {
        if (match) {
          const payload = { id: user.id };
          issueTokenAndRespond(payload, res);
        } else {
          return res.status(422).json({ error: "Password Incorrect" });
        }
      })
      .catch(e => {
        return res.status(422).json({ error: "Password Incorrect" });
      });
  });
};

exports._handleSignout = (req, res) => {
  req.logout();
  res.redirect("/");
};
