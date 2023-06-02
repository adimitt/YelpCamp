const Campground=require('../models/campground');
const Review=require('../models/reviews');

module.exports.createReview=async (req, res, next) => {
    const { id }=req.params;
    const review=new Review(req.body.review);
    const campground=await Campground.findById(id);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully Added Review');

    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview=async (req, res, next) => {

    //when using without login and without authorisation
    //it will go to login but after login it will redirect
    //with get request but we need delete req so NOT FOUND
    const { id, reviewId }=req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Successfully Deleted The Review')
    res.redirect(`/campgrounds/${id}`);
};