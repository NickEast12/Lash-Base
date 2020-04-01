const mongoose = require('mongoose');
const Review = mongoose.model('Reviews');
const Store = mongoose.model('Store');

exports.addReview = async (req, res) => {
    req.checkBody("text", "Review can't be empty").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        req.flash("error", errors.map(err => err.msg));
        res.redirect('back');
        return;
    }
    req.body.author = req.user._id;
    req.body.store = req.params.id;
    const newReview = new Review(req.body);
    await newReview.save();
    req.flash('success', 'Thank you for your review');
    res.redirect('back');
}

exports.getTop = async (req, res) => {
    const stores = await Store.find();
    const topStores = await Store.getTopStores();
    res.render('top', { title: "Top", stores: stores, topStores });
};







