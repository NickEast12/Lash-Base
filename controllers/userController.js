const mongoose = require("mongoose");
const User = mongoose.model("User");
const Store = mongoose.model("Store");
const promisify = require("es6-promisify");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");
const mail = require('../handlers/mailBooking');


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
  req.body.photo = '2020-04-06T16:31:09.294Z';
  const user = new User({ email: req.body.email, name: req.body.name, photo: req.body.photo });
  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, req.body.password);
  next(); //! pass off to auth
};
exports.explore = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 4;
  const skip = (page * limit) - limit;
  const allStores = await Store.find();
  //? so we need to query the database and get the stores
  const storesPromise = Store
    .find()
    .skip(skip)
    .limit(limit)
  const countPromise = Store.count();
  const [stores, count] = await Promise.all([storesPromise, countPromise]);

  const pages = Math.ceil(count / limit);
  if (!stores.length && skip) {
    req.flash('info', `The reqested page ${page} is not longer available, you have been redirected to page ${pages}`);
    res.redirect(`/app/explore/page/${pages}`);
    return;
  }
  const averageRating = await Store.reviewsAverage();
  res.render("appHome", { title: "Lashbase", stores: stores, averageRating, page, pages, count, allStores });
};

exports.favourites = async (req, res) => {
  const stores = await Store.find();
  const averageRating = await Store.reviewsAverage();
  const selectedStores = await Store.find({
    _id: { $in: req.user.favourites }
  });
  res.render("favourites", { title: "Favourites", selectedStores, stores, averageRating });
};
exports.bookings = async (req, res) => {
  const stores = await Store.find();
  const averageRating = await Store.reviewsAverage();
  const selectedStore = await Store.find({
    _id: { $in: req.user.bookings }
  });
  res.render("bookings", { title: "Bookings", selectedStore, stores, averageRating });
};
//? add to booking route
exports.makeBooking = async (req, res, next) => {
  //? find store with unique Slug 
  const selectedStore = await Store.findOne({ slug: req.params.slug }).populate(
    "author"
  );
  // ? get inputs from form
  const bookingForm = {
    no: req.body.contact,
    time: req.body.time,
    date: req.body.date,
    message: req.body.message,
    name: req.user.name
  };

  const sendStore = selectedStore.author.email;
  //?  send mail with content 
  await mail.send({
    sendStore,
    filename: "booking",
    subject: "Lashbase | New Booking 📫 ",
    bookingForm
  });

  //? success flash and redirect
  req.flash('success', `your email has been sent to ${selectedStore.name}`);
  res.redirect('/app/bookings');
};
