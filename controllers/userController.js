const mongoose = require("mongoose");
const User = mongoose.model('User');
const promisify = require("es6-promisify");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");


exports.registerForm = (req, res, next) => {
    res.render('register', { title: 'Register' });
};
exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', "You must supply a name!").notEmpty();
    req.checkBody('email', "This email is not valid!").notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extention: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be empty').notEmpty();
    req.checkBody('password-confirm', 'Confrim password cannot be empty').notEmpty();
    req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash("error", errors.map(err => err.msg));
        res.render("register", {
            title: "Register",
            body: req.body,
            flashes: req.flash()
        });
        return; //? stops fn from running
    };
    next(); //! pass off to register to create the user

};
exports.register = async (req, res, next) => {
    console.log('passed validation');
    const user = new User({ email: req.body.email, name: req.body.name });
    const registerWithPromise = promisify(User.register, User);
    await registerWithPromise(user, req.body.password);
    next(); //! pass off to auth 
};

exports.success = (req, res) => {
    res.render('success');
}

exports.appHome = (req, res) => {
    res.render('appHome');
}
exports.explore = (req, res) => {
    res.render('appHome', { title: 'Explore' })
};
exports.favourites = (req, res) => {
    res.render('favourites', { title: 'Favourites' })
};
exports.bookings = (req, res) => {
    res.render('bookings', { title: 'Bookings' })
};