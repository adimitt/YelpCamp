const express=require('express');
const router=express.Router({ mergeParams: true });
const mongoose=require('mongoose');
const { reviewSchema }=require('../schemas.js');
const catchAsync=require('../utilis/catchAsync');
const ExpressError=require('../utilis/ExpressError');
const Review=require('../models/reviews.js');
const Campground=require('../models/campground');




const validateReview=(req, res, next) => {
    const { error }=reviewSchema.validate(req.body);
    if (error) {
        const msg=error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, error.details);
    }
    else {
        next();
    }
}


//after filling review
router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const { id }=req.params;
    const review=new Review(req.body.review);
    const campground=await Campground.findById(id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully Added Review');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId }=req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted The Review')
    res.redirect(`/campgrounds/${id}`);
}))


module.exports=router;