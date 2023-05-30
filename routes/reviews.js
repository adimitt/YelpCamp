const express=require('express');
const router=express.Router({ mergeParams: true });
const mongoose=require('mongoose');
const { reviewSchema }=require('../schemas.js');
const catchAsync=require('../utilis/catchAsync');
const ExpressError=require('../utilis/ExpressError');
const Review=require('../models/reviews.js');
const Campground=require('../models/campground');
const { validateReview, isLoggedIn, isReviewAuthor }=require('../middleware.js');






//after filling review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const { id }=req.params;
    const review=new Review(req.body.review);
    const campground=await Campground.findById(id);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully Added Review');

    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {

    //when using without login and without authorisation
    //it will go to login but after login it will redirect
    //with get request but we need delete req so NOT FOUND
    const { id, reviewId }=req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Successfully Deleted The Review')
    res.redirect(`/campgrounds/${id}`);
}))


module.exports=router;