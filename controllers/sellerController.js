const mongoose = require("mongoose");
const Store = mongoose.model("Store");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");


const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That file type is prohibited" }, false);
    }
  }
};


exports.upload = multer(multerOptions).single("photo");
exports.resize = async (req, res, next) => {
  //? check to see if there is no new file to resize
  if (!req.file) {
    next(); //? skip to next middle ware
    return;
  }
  const extention = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${extention}`;

  //? now resizing
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  //? once we have saved our photo to our filesystem, keep going!
  next();
};



exports.createStore = (req, res) => {
  const stores = Store.find();
  res.render("createStore", { title: "Create a listing", stores });
};

exports.createListing = async (req, res) => {
  req.body.author = req.user._id;
  const store = await new Store(req.body).save();
  req.flash("success", `Successfully created ${store.name}`);
  res.redirect("/app/explore");
};

exports.editStore = async (req, res) => {
  //? first we need to find the store in question
  const store = await Store.findOne({ _id: req.params.id });
  //? confrim the owner of the store
  //! come back to this
  //? redirect them to THEIR store
  res.render("editStore", { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  //? set the location data to be a point
  req.body.location.type = "Point";
  //? find and upate the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, //! returns new store instead of old one
    runValidators: true //! force model to validate data
  }).exec();
  //? redirect it then send them onwards
  req.flash("Success", `Sucessfully Edited ${store.name}`);
  res.redirect("/app/home");
};

exports.getStoreBySlug = async (req, res) => {
  const stores = await Store.find();
  const selectedStore = await Store.findOne({ slug: req.params.id }).populate(
    "author"
  );
  res.render("eachStore", { stores, selectedStore, title: selectedStore.name });
};

exports.searchStores = async (req, res) => {
  const stores = await Store.find({
    $text: {
      $search: req.query.q
    }
  }, {
      score: { $meta: 'textScore' }
    })
    .sort({
      score: { $meta: 'textScore' }
    })
  res.json(stores);
}