const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

exports.createStore = (req, res) => {
    res.render('createStore', { title: "Create a listing" })
}

exports.createListing = async (req, res) => {
    req.body.author = req.user._id;
    const store = await new Store(req.body).save();
    req.flash('success', `Successfully created ${store.name}`);
    res.redirect('/app/explore');
};

exports.editStore = async (req, res) => {
    //? first we need to find the store in question 
    const store = await Store.findOne({ _id: req.params.id });
    //? confrim the owner of the store
    //! come back to this
    //? redirect them to THEIR store 
    res.render('editStore', { title: `Edit ${store.name}`, store });
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

