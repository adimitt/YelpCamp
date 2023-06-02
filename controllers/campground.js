const Campground=require('../models/campground');
const { cloudinary }=require('../cloudinary');
// const { ExpressError }=require('../utilis/ExpressError');
// let nodeGeocoder=require('node-geocoder');
const maptilerClient=require('@maptiler/client');
maptilerClient.config.apiKey=process.env.MAPTILE_TOKEN;

// let options={
//     provider: 'openstreetmap'
// };

// let geoCoder=nodeGeocoder(options);



module.exports.index=async (req, res, next) => {

    const camps=await Campground.find({});
    res.render('campgrounds/index', { camps });
};

module.exports.createCampground=async (req, res, next) => {
    // if (!req.body.campground) {
    //     // console.log(req.body);
    //     throw new ExpressError('No campground in Request', 400);
    // }

    const campground=new Campground(req.body.campground);
    // const loc=await geoCoder.geocode(req.body.campground.location);
    //campground.geometry=[loc[0].longitude, loc[0].latitude];
    const result=await maptilerClient.geocoding.forward(req.body.campground.location);
    campground.geometry=result.features[0].geometry;
    campground.images=req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author=req.user._id;

    await campground.save();
    req.flash('success', 'Successfully Created New Campground');
    res.redirect(`/campgrounds/${campground._id}`);

};

module.exports.renderForm=(req, res) => {
    res.render('campgrounds/new');
}

module.exports.renderEditForm=async (req, res, next) => {
    const { id }=req.params;
    const camp=await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Campground Does Not Exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
};

module.exports.updateCampground=async (req, res, next) => {
    const { id }=req.params;
    const campground=await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    //(id,req.body.campground)req.body.campgound is same as {...req.body.campground},
    // however the second one creates a new object (so new reference in memory, better 
    //routerroach as I know), also sometimes we need to add some other property such as 
    //{...req.body.campground, anotherProp: value }
    const imgs=req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(req.body.deleteImages);
    }
    req.flash('success', 'Successfully Updated The Campground');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground=async (req, res, next) => {
    const { id }=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Campground')
    res.redirect('/campgrounds');
};

module.exports.showCampground=async (req, res, next) => {
    const { id }=req.params;
    const camp=await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Campground Does Not Exist');
        return res.redirect('/campgrounds');
    }
    // res.send("Welcome");
    res.render('campgrounds/show', { camp });
};




