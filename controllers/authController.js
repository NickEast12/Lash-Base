const crypto = require("crypto");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Store = mongoose.model('Store');
const promisify = require("es6-promisify");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");
// const mail = require("../handlers/mail");

exports.login = passport.authenticate("local", {
  failureRedirect: "/",
  failureFlash: "Failed Login",
  successRedirect: "/app/home"
});

exports.logout = (req, res) => {
  req.logout();
  console.log("user logged out");
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  //? check to see if the user is logged in
  if (req.isAuthenticated()) {
    console.log("the user is logged in");
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
    name: req.body.name
  };
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );
  req.flash("success", "You have updated you account");
  res.redirect("/app/explore");
};
