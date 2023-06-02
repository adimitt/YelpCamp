const express=require('express');
const router=express.Router({ mergeParams: true });
const catchAsync=require('../utilis/catchAsync');
const review=require('../controllers/review.js');
const { validateReview, isLoggedIn, isReviewAuthor }=require('../middleware.js');


router.route('/')
    .post(isLoggedIn, validateReview, catchAsync(review.createReview));

router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));


module.exports=router;