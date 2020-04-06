const crypto = require("crypto");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Store = mongoose.model('Store');
const promisify = require("es6-promisify");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");
const mail = require("../handlers/mail");

exports.login = passport.authenticate("local", {
  failureRedirect: "/",
  failureFlash: "Failed Login",
  successRedirect: "/app/home",
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  //? check to see if the user is logged in
  if (req.isAuthenticated()) {
    next();
    return;
  }
  //? if they are they will be send back to the login page
  res.redirect("/login");
};

exports.userAccount = async (req, res, next) => {
  const stores = await Store.find();
  res.render("userAccount", { title: "Update Account", stores });
};


exports.userUpdate = async (req, res) => {
  const updates = {
    email: req.body.email,
    name: req.body.name,
    photo: req.body.photo
  };
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );
  res.json(user);
  req.flash("success", "You have updated you account, you will need to login in again");
  // res.redirect("/");
};

exports.forgotPassword = async (req, res) => {
  await res.render('forgot', { title: 'Forgot Password' });

}

exports.forgot = async (req, res) => {
  //? check if there is a user 
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'That account does not exist');
    return res.redirect('/user/forgot');
  }
  //? set tokens up with a timeout
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // one hour from now
  await user.save(); //  wait till user has saved

  //? send email with token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    filename: "password-reset",
    subject: "Password Reset ",
    resetURL
  });

  req.flash('success', 'You have been emailed a password reset link');
  res.redirect('/');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  //! if no user
  if (!user) {
    req.flash("error", "Password reset is invalid or had expired");
    return res.redirect("/login");
  }
  // ! if user is found
  res.render("reset", { title: "Reset your Password" });
};


exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    next(); // keep it going
    return;
  }
  req.flash("error", "Passwords do not match");
  res.redirect("back");
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordToken: { $gt: Date.now() }
  });
  //? check if there is a user
  if (!user) {
    req.flash("error", "Password reset link is invalid or has expired");
    return res.redirect("/login");
  }
  //   //? update password
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updateUser = await user.save();
  await req.login(updateUser);
  req.flash("success", "Your password has been reset");
  res.redirect("/");
};
