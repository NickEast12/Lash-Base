const mongoose = require("mongoose");
const User = mongoose.model("User");
const Store = mongoose.model("Store");
const promisify = require("es6-promisify");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

exports.registerForm = (req, res, next) => {
  res.render("register", { title: "Register" });
};
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody("name");
  req.checkBody("name", "You must supply a name!").notEmpty();
  req.checkBody("email", "This email is not valid!").notEmpty();
  req.sanitizeBody("email").normalizeEmail({
    remove_dots: false,
    remove_extention: false,
    gmail_remove_subaddress: false
  });
  req.checkBody("password", "Password cannot be empty").notEmpty();
  req
    .checkBody("password-confirm", "Confrim password cannot be empty")
    .notEmpty();
  req
    .checkBody("password-confirm", "Passwords do not match")
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors.map(err => err.msg));
    res.render("register", {
      title: "Register",
      body: req.body,
      flashes: req.flash()
    });
    return; //? stops fn from running
  }
  next(); //! pass off to register to create the user
};
exports.register = async (req, res, next) => {
  console.log("passed validation");
  const user = new User({ email: req.body.email, name: req.body.name });
  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, req.body.password);
  next(); //! pass off to auth
};

exports.explore = async (req, res) => {
  //? so we need to query the database and get the stores
  const stores = await Store.find();
  // console.log(stores);
  res.render("appHome", { title: "Explore", stores: stores });
};
exports.favourites = async (req, res) => {
  const stores = await Store.find();
  res.render("favourites", { title: "Favourites", stores });
};
exports.bookings = async (req, res) => {
  const stores = await Store.find();
  res.render("bookings", { title: "Bookings", stores });
};
