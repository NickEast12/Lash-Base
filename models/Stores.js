const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter your business name'
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    menu: {
        type: {
            type: String
        },
        treatment: [{
            type: String
        }],
        price: [{
            type: Number
        }]
    },
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [
            {
                type: Number,
                required: 'You must supply a business location'
            }
        ],
        address: {
            type: String,
            required: 'You must supply a address'
        }
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    }
}, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    });
//? Define our indexs
storeSchema.index({
    name: 'text',
    description: 'text'
});
storeSchema.index({ location: '2dsphere' });


storeSchema.pre("save", async function (next) {
    if (!this.isModified("name")) {
        next(); // skip it
        return; // stop this function from running
    }
    this.slug = slug(this.name);
    //? find duplicate stores
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }

    next();
    // TODO make more resiliant so slugs are unique
});

//agregration 
storeSchema.statics.getTopStores = function () {
    return this.aggregate([
        //?look for stores and populate reviews
        { $lookup: { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' } },
        //? filter for only item that have 2 or more reviews
        { $match: { 'reviews.1': { $exists: true } } },
        //? add the average review fields 
        {
            $project: {
                photo: '$$ROOT.photo',
                name: '$$ROOT.name',
                reviews: '$$ROOT.reviews',
                slug: '$$ROOT.slug',
                averageRating: { $avg: '$reviews.rating' }
            }
        },
        //? sort by highest first 
        { $sort: { averageRating: -1 } },
        //? limit to 10 
        { $limit: 10 }
    ])
}
storeSchema.statics.reviewsAverage = function () {
    return this.aggregate([
        //?look for stores and populate reviews
        { $lookup: { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' } },
        //? add the average review fields 
        {
            $project: {
                averageRating: { $avg: '$reviews.rating' },
                slug: '$$ROOT.slug'
            }
        }
    ])
}

storeSchema.virtual('reviews', {
    ref: 'Reviews', //? what model to link
    localField: '_id', //? which field from stores
    foreignField: 'store' //?which field from reviews 
});



module.exports = mongoose.model('Store', storeSchema);