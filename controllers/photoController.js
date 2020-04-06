const mongoose = require("mongoose");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cloudinaryStorage = require('multer-storage-cloudinary');
const jimp = require('jimp');
const Store = mongoose.model("Store");
const User = mongoose.model("User");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    }
})



exports.cloudUpload = async (req, res, next) => {
    const upload = multer({ storage }).single('photo')
    upload(req, res, function (err) {
        if (err) {
            return res.send(err)
        }
        // SEND FILE TO CLOUDINARY
        cloudinary.config({
            cloud_name: process.env.C_NAME,
            api_key: process.env.C_API_KEY,
            api_secret: process.env.C_API_SECRET
        });


        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
        cloudinary.uploader.upload(
            path,
            { public_id: `pictures/${uniqueFilename}`, tags: `photos` }, // directory and tags are optional
            function (err, image) {
                if (err) return res.send(err)
                req.body.author = req.user._id;
                req.body.photo = uniqueFilename;
                const store = (new Store(req.body)).save();
                req.flash('success', `Store sucessfully created`);
                res.redirect(`/app/explore`);
                // remove file from server
                const fs = require('fs')
                fs.unlinkSync(path)
            }
        )
    });


}

exports.updateCloudStore = (req, res) => {
    const upload = multer({ storage }).single('photo')
    upload(req, res, function (err) {
        if (err) {
            return res.send(err)
        }

        // SEND FILE TO CLOUDINARY
        cloudinary.config({
            cloud_name: process.env.C_NAME,
            api_key: process.env.C_API_KEY,
            api_secret: process.env.C_API_SECRET
        });


        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
        cloudinary.uploader.upload(
            path,
            { public_id: `pictures/${uniqueFilename}`, tags: `photos` }, // directory and tags are optional
            function (err, image) {
                if (err) return res.send(err)
                req.body.photo = uniqueFilename;
                //? set the location data to be a point
                req.body.location.type = "Point";
                //? find and upate the store
                const store = Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
                    new: true, //! returns new store instead of old one
                    runValidators: true //! force model to validate data
                }).exec();
                //? redirect it then send them onwards
                req.flash("success", `Sucessfully Edited Your Store`);
                res.redirect("/app/home");
                // remove file from server
                const fs = require('fs')
                fs.unlinkSync(path)
            }
        )
    });
};

exports.registerUser = (req, res) => {
    const upload = multer({ storage }).single('photo')
    upload(req, res, function (err) {
        if (err) {
            return res.send(err)
        }
        // SEND FILE TO CLOUDINARY
        cloudinary.config({
            cloud_name: process.env.C_NAME,
            api_key: process.env.C_API_KEY,
            api_secret: process.env.C_API_SECRET
        });


        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
        cloudinary.uploader.upload(
            path,
            { public_id: `pictures/${uniqueFilename}`, tags: `photos` }, // directory and tags are optional
            function (err, image) {
                if (err) return res.send(err)
                req.body.author = req.user._id;
                req.body.photo = uniqueFilename;
                const store = (new Store(req.body)).save();
                req.flash('success', `Store sucessfully created`);
                res.redirect(`/app/explore`);
                // remove file from server
                const fs = require('fs')
                fs.unlinkSync(path)
            }
        )
    });
};

exports.updateAccountCloud = async (req, res) => {
    const upload = multer({ storage }).single('photo')
    upload(req, res, function (err) {
        if (err) {
            return res.send(err)
        }
        // SEND FILE TO CLOUDINARY
        cloudinary.config({
            cloud_name: process.env.C_NAME,
            api_key: process.env.C_API_KEY,
            api_secret: process.env.C_API_SECRET
        });


        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
        cloudinary.uploader.upload(
            path,
            { public_id: `cover/${uniqueFilename}`, tags: `cover` }, // directory and tags are optional
            async function (err, image) {
                if (err) return res.send(err)

                const updates = {
                    email: req.body.email,
                    name: req.body.name,
                    photo: uniqueFilename
                };
                const user = await User.findByIdAndUpdate(
                    { _id: req.user._id },
                    { $set: updates },
                    { new: true, runValidators: true, context: "query" }
                );
                req.flash("success", "You have updated you account, you will need to login in again");
                res.redirect('/app/explore');
                // remove file from server
                const fs = require('fs')
                fs.unlinkSync(path)
            }
        )
    });
};
